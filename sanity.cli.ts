import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "qu60lpod",
    dataset: "production",
  },
  deployment: {
    /**
     * Auto-updates apply only to standalone `sanity deploy` builds,
     * not to Next-embedded NextStudio.
     */
    autoUpdates: true,
  },
  vite: {
    // Next.js public Sanity vars must be visible to the Vite Studio bundle.
    envPrefix: ["SANITY_STUDIO_", "NEXT_PUBLIC_", "VITE_"],
    server: {
      watch: {
        ignored: ["**/.next/**", "**/node_modules/**"],
      },
    },
  },
});
