import { formatValue } from "./format";

export type RunResult =
  | { ok: true; logs: string[]; values: unknown }
  | { ok: false; logs: string[]; error: string };

const TIMEOUT_MILLISECONDS = 2500;

// Runs inside a Web Worker so an infinite loop can be stopped by terminating it.
// `extract` may evaluate to a Promise (for async lessons); the worker waits for it.
const WORKER_SOURCE = `
self.onmessage = (e) => {
  const logs = [];
  const fmt = v => typeof v === 'string' ? JSON.stringify(v) : (Array.isArray(v) ? '[' + v.map(fmt).join(', ') + ']' : (v && typeof v==='object' ? JSON.stringify(v) : String(v)));
  self.console = { log: (...a) => logs.push(a.map(x => typeof x === 'string' ? x : fmt(x)).join(' ')) };
  Promise.resolve()
    .then(() => {
      const fn = new Function(e.data.code + '\\n;return (' + e.data.extract + ');');
      return fn();
    })
    .then((vals) => {
      self.postMessage({ ok:true, logs, values: JSON.parse(JSON.stringify(vals === undefined ? null : vals, (k,v)=> v===undefined ? '__undef__' : v)) });
    })
    .catch((err) => {
      const name = err && err.name ? err.name : 'Error';
      const message = err && err.message !== undefined ? err.message : String(err);
      self.postMessage({ ok:false, logs, error: name + ': ' + message });
    });
};`;

let workerUrl: string | null = null;

function getWorkerUrl(): string {
  if (workerUrl === null) {
    const blob = new Blob([WORKER_SOURCE], { type: "text/javascript" });
    workerUrl = URL.createObjectURL(blob);
  }
  return workerUrl;
}

function replaceUndefined(_key: string, value: unknown): unknown {
  if (value === undefined) {
    return "__undef__";
  }
  return value;
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.name + ": " + error.message;
  }
  return String(error);
}

/**
 * Fallback for browsers that block workers. It has no infinite-loop
 * protection, which is why the worker is preferred.
 */
async function runInline(code: string, extract: string): Promise<RunResult> {
  const logs: string[] = [];
  const originalLog = console.log;

  console.log = (...args: unknown[]) => {
    const parts: string[] = [];
    for (const arg of args) {
      parts.push(typeof arg === "string" ? arg : formatValue(arg));
    }
    logs.push(parts.join(" "));
  };

  try {
    const learnerFunction = new Function(code + "\n;return (" + extract + ");");
    const rawValues = await learnerFunction();
    const values = JSON.parse(JSON.stringify(rawValues, replaceUndefined));
    return { ok: true, logs, values };
  } catch (error) {
    return { ok: false, logs, error: describeError(error) };
  } finally {
    console.log = originalLog;
  }
}

/**
 * Runs learner code in a sandboxed worker, then evaluates `extract`
 * to pull out the values the exercise checks need.
 */
export function runCode(code: string, extract: string): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(getWorkerUrl());
    } catch {
      runInline(code, extract).then(resolve);
      return;
    }

    const timeoutId = setTimeout(() => {
      worker.terminate();
      resolve({
        ok: false,
        logs: [],
        error: "Your code took too long. Is there a loop that never stops?",
      });
    }, TIMEOUT_MILLISECONDS);

    worker.onmessage = (event: MessageEvent<RunResult>) => {
      clearTimeout(timeoutId);
      worker.terminate();
      resolve(event.data);
    };

    worker.postMessage({ code, extract });
  });
}
