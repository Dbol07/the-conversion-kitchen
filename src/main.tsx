
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@/styles/backgrounds.css";
import "@/styles/fonts.css";

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
