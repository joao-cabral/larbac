import { defineConfig } from "astro/config";

import icon from "astro-icon";

export default defineConfig({
  site: "https://larbac.me",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    icon({
      include: {
        mdi: ["github", "account-file-outline", "linkedin", "arrow-left", "file-download", "facebook", "instagram", "whatsapp"],
      },
    }),
  ],
});
