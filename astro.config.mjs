import { defineConfig } from "astro/config";

import icon from "astro-icon";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://larbac.me",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    react(),
    icon({
      include: {
        mdi: ["github", "account-file-outline", "linkedin", "arrow-left", "file-download", "facebook", "instagram", "whatsapp"],
      },
    }),
  ],
});
