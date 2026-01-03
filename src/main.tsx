import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register'
import App from "./app/App.tsx";
import "./styles/index.css";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('SW: New content available');
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('SW: App ready to work offline');
  },
  onRegistered(r) {
    console.log('SW: Service worker registered', r);
  },
  onRegisterError(error) {
    console.error('SW: Service worker registration failed', error);
  }
})

createRoot(document.getElementById("root")!).render(<App />);
