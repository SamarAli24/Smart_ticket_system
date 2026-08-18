import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev the SPA runs on :5173 while the API runs on the Kestrel port from
      // Backend/TicketSystem.Api/Properties/launchSettings.json. Proxying /api keeps the
      // frontend on same-origin relative URLs, which is exactly how it behaves in
      // production once the build is served from the API's wwwroot.
      "/api": {
        target: "https://localhost:7276",
        changeOrigin: true,
        // The .NET https dev certificate is self-signed; don't reject it.
        secure: false,
      },
    },
  },
});
