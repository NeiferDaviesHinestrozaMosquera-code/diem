import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n'
import { getPublicSiteSettings } from '@/services/Settings.ts'

// ─── Actualiza favicon y título desde Supabase ────────────────────────────────
// Se ejecuta una sola vez al arrancar la app, sin bloquear el render de React.
// Si Supabase falla o no tiene datos, se mantiene el favicon estático del HTML.

async function applyDynamicBranding() {
  try {
    const settings = await getPublicSiteSettings();
    if (!settings) return;

    // ── Título de la pestaña ──────────────────────────────────────────────────
    if (settings.siteName) {
      document.title = settings.siteName;
    }

    // ── Favicon dinámico ─────────────────────────────────────────────────────
    if (settings.favicon) {
      // Detectar extensión para asignar el tipo MIME correcto
      const ext = settings.favicon.split('.').pop()?.toLowerCase() ?? '';
      const mimeMap: Record<string, string> = {
        png:  'image/png',
        jpg:  'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        svg:  'image/svg+xml',
        ico:  'image/x-icon',
        gif:  'image/gif',
      };
      const mimeType = mimeMap[ext] ?? 'image/webp';

      // Actualizar o crear todos los tags de favicon existentes
      const selectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
      ];

      selectors.forEach((selector) => {
        const el = document.querySelector<HTMLLinkElement>(selector);
        if (el) {
          el.href = settings.favicon;
          el.type = mimeType;
        }
      });

      // Por si no existía ningún tag de favicon en el HTML
      const existingIcon = document.querySelector('link[rel="icon"]');
      if (!existingIcon) {
        const link = document.createElement('link');
        link.rel  = 'icon';
        link.type = mimeType;
        link.href = settings.favicon;
        document.head.appendChild(link);
      }
    }
  } catch (error) {
    // Fallo silencioso — el favicon estático del index.html permanece
    console.warn('No se pudo cargar branding dinámico:', error);
  }
}

// Ejecutar sin bloquear el render de React
applyDynamicBranding();

// ─── Mount React ──────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)