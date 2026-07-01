import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import solid from "vite-plugin-solid";

// Allow dynamic base via environment variable so GitHub Pages project site works under /<repo-name>/
// Locally (dev) it remains '/'. In the deploy workflow we inject VITE_APP_BASE=/new-card-img-gen/.
export default defineConfig(({ mode }) => {
  // Use '.' as root to avoid depending on Node types for process.cwd()
  const env = loadEnv(mode, ".", "");
  const base = env.VITE_APP_BASE || "/";
  return {
    base,
    plugins: [solid(), tailwindcss()],
    envPrefix: "ASSETS_API_ENDPOINT",
  };
});
