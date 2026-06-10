import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // allow the current ngrok hostname; replace or add more hosts if needed
    allowedHosts: ["flatbed-falcon-custody.ngrok-free.dev"],
  },
})
