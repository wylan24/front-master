"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/** Re-renders whenever data-theme on <html> changes, wherever it was changed from. */
function subscribeToThemeAttribute(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** The server can't know the theme, so it renders a neutral label. */
function readThemeOnServer(): null {
  return null;
}

function saveTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}

/** A day/dark switch. The icons are swapped by CSS, so the right one shows before hydration. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeToThemeAttribute,
    readTheme,
    readThemeOnServer
  );

  let label = "Switch colour theme";
  if (theme === "light") {
    label = "Switch to dark mode";
  }
  if (theme === "dark") {
    label = "Switch to day mode";
  }

  function toggle() {
    const nextTheme: Theme = readTheme() === "dark" ? "light" : "dark";
    saveTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 flex-none cursor-pointer place-items-center rounded-[10px] border-[1.5px] border-border bg-surface text-ink transition-colors outline-none hover:border-ink focus-visible:ring-3 focus-visible:ring-ring/40",
        className
      )}
    >
      {/* Moon in day mode (click for dark); sun in dark mode (click for day). */}
      <Moon aria-hidden="true" className="size-[18px] [[data-theme=dark]_&]:hidden" />
      <Sun aria-hidden="true" className="hidden size-[18px] [[data-theme=dark]_&]:block" />
    </button>
  );
}
