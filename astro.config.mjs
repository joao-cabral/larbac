import { defineConfig } from "astro/config";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      include: {
        mdi: [
          "github",
          "account-file-outline",
          "linkedin",
          "arrow-left",
          "file-download",
          "facebook",
          "instagram",
          "whatsapp",
        ],
      },
    }),
  ],
});
