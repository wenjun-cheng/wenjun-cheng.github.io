import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://wenjun-cheng.github.io",
  base: "/",
  output: "static",
  devToolbar: { enabled: false },
  integrations: [react()],
});
