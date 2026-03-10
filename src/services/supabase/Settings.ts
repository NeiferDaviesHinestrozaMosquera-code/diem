import { supabase } from "@/lib/supabase-complete";
import type { SiteSettings } from "@/types";

const PUBLIC_SETTINGS_COLUMNS = [
  'id',
  'site_name',
  'tagline',
  'logo',
  'favicon',
  'footer_text',
  'contact_email',
  'contact_phone',
  'contact_address',
  'contact_info',
  'social_links',
  'primary_color',
  'secondary_color',
  'accent_color',
  'hero_title',
  'hero_subtitle',
  'contact_text',
  'hero_images',
  'carousel_images',
].join(',');

/** Mapea una fila de la BD al tipo SiteSettings */
function mapSiteSettings(data: any): SiteSettings {
  // ✅ MEJORA: contact_info JSONB tiene prioridad; si falta, se construye
  //    desde las columnas individuales para que nunca quede vacío.
  const contactInfo: SiteSettings['contactInfo'] = data.contact_info ?? {
    email:   data.contact_email   ?? '',
    phone:   data.contact_phone   ?? '',
    address: data.contact_address ?? '',
  };

  const socialLinks: SiteSettings['socialLinks'] = data.social_links ?? {};

  return {
    id:                     data.id,
    siteName:               data.site_name               ?? '',
    tagline:                data.tagline                 ?? '',
    heroTitle:              data.hero_title              ?? '',
    heroSubtitle:           data.hero_subtitle           ?? '',
    aboutText:              data.about_text              ?? '',
    servicesText:           data.services_text           ?? '',
    projectsText:           data.projects_text           ?? '',
    contactText:            data.contact_text            ?? '',
    logo:                   data.logo                   ?? '',
    favicon:                data.favicon                 ?? '',
    primaryColor:           data.primary_color           ?? '',
    secondaryColor:         data.secondary_color         ?? '',
    accentColor:            data.accent_color            ?? '',
    contactEmail:           data.contact_email           ?? '',
    contactPhone:           data.contact_phone           ?? '',
    contactAddress:         data.contact_address         ?? '',
    socialLinks,
    contactInfo,
    carouselImages:         data.carousel_images         ?? [],
    heroImages:             data.hero_images             ?? [],
    servicesImages:         data.services_images         ?? [],
    testimonialsBackground: data.testimonials_background ?? '',
    footerText:             data.footer_text             ?? '',
    metaDescription:        data.meta_description        ?? '',
    metaKeywords:           data.meta_keywords           ?? '',
    googleAnalyticsId:      data.google_analytics_id     ?? '',
    customScripts:          data.custom_scripts          ?? '',
  } as SiteSettings;
}

/** Obtiene la configuración completa (para el panel admin) */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'site')
    .maybeSingle();

  if (error) {
    console.error('Error al obtener configuración:', error);
    throw error;
  }

  return data ? mapSiteSettings(data) : null;
};

/** ✅ NUEVO: Obtiene solo los campos necesarios para componentes públicos.
 *  Úsalo en Footer, Contact, Header, etc. para reducir el payload. */
export const getPublicSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select(PUBLIC_SETTINGS_COLUMNS)
    .eq('id', 'site')
    .maybeSingle();

  if (error) {
    console.error('Error al obtener configuración pública:', error);
    throw error;
  }

  return data ? mapSiteSettings(data) : null;
};

export const subscribeToSiteSettings = (
  callback: (settings: SiteSettings | null) => void,
  pollIntervalMs = 30_000,
): () => void => {
  const channelName = `site_settings_changes_${Date.now()}`;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let realtimeOk = false;

  const startPolling = () => {
    if (pollTimer) return;
    console.info('Realtime no disponible, activando polling cada', pollIntervalMs, 'ms');
    pollTimer = setInterval(async () => {
      // ✅ MEJORA: el listener público usa getPublicSiteSettings
      const settings = await getPublicSiteSettings();
      callback(settings);
    }, pollIntervalMs);
  };

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  const subscription = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_settings', filter: 'id=eq.site' },
      async () => {
        const settings = await getPublicSiteSettings();
        callback(settings);
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        realtimeOk = true;
        stopPolling();
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || err) {
        if (!realtimeOk) {
          console.warn('Realtime site_settings falló, usando polling:', status, err?.message);
          startPolling();
        }
      }
    });

  return () => {
    stopPolling();
    supabase.removeChannel(subscription);
  };
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  const updateData: any = {};

  const mapping: Record<string, string> = {
    siteName:               'site_name',
    heroTitle:              'hero_title',
    heroSubtitle:           'hero_subtitle',
    aboutText:              'about_text',
    servicesText:           'services_text',
    projectsText:           'projects_text',
    contactText:            'contact_text',
    primaryColor:           'primary_color',
    secondaryColor:         'secondary_color',
    accentColor:            'accent_color',
    contactEmail:           'contact_email',
    contactPhone:           'contact_phone',
    contactAddress:         'contact_address',
    socialLinks:            'social_links',
    contactInfo:            'contact_info',
    carouselImages:         'carousel_images',
    heroImages:             'hero_images',
    servicesImages:         'services_images',
    testimonialsBackground: 'testimonials_background',
    footerText:             'footer_text',
    metaDescription:        'meta_description',
    metaKeywords:           'meta_keywords',
    googleAnalyticsId:      'google_analytics_id',
    customScripts:          'custom_scripts',
    tagline:                'tagline',
    logo:                   'logo',
    favicon:                'favicon',
  };

  Object.keys(mapping).forEach(key => {
    const typedKey = key as keyof typeof settings;
    if (typedKey in settings) {
      updateData[mapping[key]] = settings[typedKey];
    }
  });

  // ✅ MEJORA: cuando llega contactInfo, sincronizar también las columnas individuales
  //    para evitar que queden desincronizados los dos sistemas de almacenamiento.
  if (settings.contactInfo) {
    updateData.contact_info    = settings.contactInfo;
    updateData.contact_email   = settings.contactInfo.email   ?? updateData.contact_email;
    updateData.contact_phone   = settings.contactInfo.phone   ?? updateData.contact_phone;
    updateData.contact_address = settings.contactInfo.address ?? updateData.contact_address;
  }

  // ✅ MEJORA: y al revés — si llegan columnas individuales, actualizar el JSONB también
  if (settings.contactEmail || settings.contactPhone || settings.contactAddress) {
    updateData.contact_info = {
      email:   settings.contactEmail   ?? '',
      phone:   settings.contactPhone   ?? '',
      address: settings.contactAddress ?? '',
    };
  }

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 'site', ...updateData });

  if (error) {
    console.error('Error al actualizar configuración:', error);
    throw error;
  }
};