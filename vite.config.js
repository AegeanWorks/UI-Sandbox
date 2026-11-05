import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Bind IPv4 loopback explicitly: on machines where `localhost` resolves to
  // ::1 first, the default bind leaves http://127.0.0.1 unreachable and the
  // page looks dead. 127.0.0.1 works in every browser, no flags needed.
  server: { host: "127.0.0.1" },
  preview: { host: "127.0.0.1" },
});
