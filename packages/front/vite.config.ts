import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { dependenciesToPrebundle } from "./vite.helpers";

export default defineConfig({
  optimizeDeps: {
    include: [...dependenciesToPrebundle],
  },

  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
