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
        mdi: ["github", "account-file-outline", "linkedin", "arrow-left", "file-download", "facebook", "instagram", "whatsapp", "web", "source-branch", "credit-card", "car-wrench", "cog", "check-decagram", "map-marker", "cellphone", "access-point", "cloud-outline", "chart-line", "test-tube", "weather-windy", "database", "printer-3d-nozzle", "cart", "open-in-new"],
        "simple-icons": ["react", "typescript", "flutter", "angular", "nodedotjs", "postgresql"],
      },
    }),
  ],
});
