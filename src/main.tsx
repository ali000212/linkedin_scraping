import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DatabaseProvider } from './contexts/DatabaseContext'

createRoot(document.getElementById("root")!).render(
  <DatabaseProvider>
    <App />
  </DatabaseProvider>
);
