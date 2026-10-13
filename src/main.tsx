import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

(window as unknown as { __CAMPUSPULSE_LOADED__: boolean }).__CAMPUSPULSE_LOADED__ = true;

createRoot(document.getElementById('root')!).render(<App />);
