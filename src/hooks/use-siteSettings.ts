import { useState, useEffect } from 'react';
import { getSiteSettings, subscribeToSiteSettings } from '@/services/supabase';
import type { SiteSettings } from '@/types';

interface UseSiteSettingsReturn {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

export function useSiteSettings(): UseSiteSettingsReturn {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const init = async () => {
      try {
        // Carga inicial para mostrar datos lo antes posible
        const initial = await getSiteSettings();
        setSettings(initial);
      } catch (err) {
        console.error('Error cargando site settings:', err);
        setError('No se pudo cargar la configuración del sitio');
      } finally {
        setLoading(false);
      }

      // Suscripción en tiempo real: actualiza el estado ante cualquier cambio en BD
      unsubscribe = subscribeToSiteSettings((updated) => {
        setSettings(updated);
      });
    };

    init();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return { settings, loading, error };
}