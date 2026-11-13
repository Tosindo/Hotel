import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from a subpath (/Hotel/), while the
  // Cloudflare deploy lives at the domain root. BASE_PATH lets the Pages
  // workflow point the build at the right place without affecting the root.
  base: process.env.BASE_PATH || "/",
  plugins: [react(), cloudflare()],
});
