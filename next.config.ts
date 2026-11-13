import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages hosts static files only, so `next build` writes a static site to ./out.
  output: "export",
  // GitHub Pages serves project sites from /<repo-name>. The deploy workflow sets
  // PAGES_BASE_PATH; locally it's unset, so the site runs from the root.
  basePath: process.env.PAGES_BASE_PATH,
  experimental: {
    agentFeedback: true,
  },
  // cacheComponents and partialPrefetching were removed: they turn on partial
  // prerendering, which needs a server and can't be combined with output: "export".
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
