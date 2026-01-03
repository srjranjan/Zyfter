import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register'
import App from "./app/App.tsx";
import "./styles/index.css";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
})

createRoot(document.getElementById("root")!).render(<App />);
