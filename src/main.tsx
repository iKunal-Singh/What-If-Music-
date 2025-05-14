
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Using createRoot API for React 18's concurrent features
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  console.error("Root element not found");
}
