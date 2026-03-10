import { supabase } from '@/lib/supabase-complete';
import type { Service, Project, Testimonial, QuoteRequest, SiteSettings } from '@/types';

// ============================================
// SERVICIOS
// ============================================

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
  
  return (data || []).map(item => ({
    ...item,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  } as Service));
};

export const subscribeToServices = (callback: (services: Service[]) => void) => {
  const subscription = supabase
    .channel('services_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, async () => {
      const services = await getServices();
      callback(services);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('services')
    .insert([{
      title: service.title,
      description: service.description,
      long_description: service.longDescription,
      icon: service.icon,
      image: service.image,
      price: service.price,
      features: service.features,
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error al agregar servicio:', error);
    throw error;
  }
  
  return data.id;
};

export const updateService = async (id: string, service: Partial<Service>) => {
  const updateData: any = { ...service };
  if (service.longDescription) {
    updateData.long_description = service.longDescription;
    delete updateData.longDescription;
  }
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error al actualizar servicio:', error);
    throw error;
  }
};

export const deleteService = async (id: string) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error al eliminar servicio:', error);
    throw error;
  }
};

// ============================================
// PROYECTOS
// ============================================

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
  
  return (data || []).map(item => ({
    ...item,
    longDescription: item.long_description,
    completionDate: item.completion_date,
    projectUrl: item.project_url,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  } as Project));
};

export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  const subscription = supabase
    .channel('projects_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async () => {
      const projects = await getProjects();
      callback(projects);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      title: project.title,
      description: project.description,
      long_description: project.longDescription,
      client: project.client,
      category: project.category,
      technologies: project.technologies,
      images: project.images,
      project_url: project.projectUrl,
      completion_date: project.completionDate,
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error al agregar proyecto:', error);
    throw error;
  }
  
  return data.id;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const updateData: any = { ...project };

  // Convertir camelCase → snake_case usando !== undefined
  // para que campos vacíos ("") también se conviertan correctamente
  if (project.longDescription !== undefined) {
    updateData.long_description = project.longDescription;
    delete updateData.longDescription;
  }
  if (project.projectUrl !== undefined) {
    updateData.project_url = project.projectUrl;
    delete updateData.projectUrl;
  }
  if (project.completionDate !== undefined) {
    updateData.completion_date = project.completionDate;
    delete updateData.completionDate;
  }

  // Eliminar campos que NO existen como columnas en Supabase
  delete updateData.createdAt;
  delete updateData.updatedAt;
  delete updateData.id; // no sobreescribir el id en el body

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error al actualizar proyecto:', error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error al eliminar proyecto:', error);
    throw error;
  }
};

// ============================================
// TESTIMONIOS
// ============================================

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener testimonios:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    clientName: item.client_name,
    createdAt:  new Date(item.created_at),
  } as Testimonial));
};

export const subscribeToTestimonials = (callback: (testimonials: Testimonial[]) => void) => {
  const subscription = supabase
    .channel(`testimonials_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, async () => {
      const testimonials = await getTestimonials();
      callback(testimonials);
    })
    .subscribe((status, err) => {
      if (err) console.warn('Realtime testimonials:', status, err.message);
    });

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      client_name: testimonial.clientName,
      company:     testimonial.company,
      content:     testimonial.content,
      rating:      testimonial.rating,
      avatar:      testimonial.avatar,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar testimonio:', error);
    throw error;
  }

  return data.id;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
  const updateData: any = { ...testimonial };

  if (testimonial.clientName !== undefined) {
    updateData.client_name = testimonial.clientName;
    delete updateData.clientName;
  }

  delete updateData.createdAt;
  delete updateData.id;

  // ✅ MEJORA: updated_at en testimonials (requiere la columna en BD)
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar testimonio:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar testimonio:', error);
    throw error;
  }
};

// ============================================
// SOLICITUDES DE COTIZACIÓN
// ============================================

export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }

  return (data || []).map(item => ({
    id:             item.id,
    fullName:       item.full_name,
    email:          item.email,
    company:        item.company,
    phone:          item.phone,
    service:        item.service,
    projectDetails: item.project_details,
    status:         item.status,
    aiReport:       item.ai_report,
    pdfUrl:         item.pdf_url,
    createdAt:      new Date(item.created_at),
    updatedAt:      new Date(item.updated_at),
  } as QuoteRequest));
};

export const subscribeToQuoteRequests = (callback: (requests: QuoteRequest[]) => void) => {
  const subscription = supabase
    .channel(`quote_requests_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, async () => {
      const requests = await getQuoteRequests();
      callback(requests);
    })
    .subscribe((status, err) => {
      if (err) console.warn('Realtime quote_requests:', status, err.message);
    });

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addQuoteRequest = async (
  request: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'aiReport' | 'pdfUrl'>
) => {
  const { data, error } = await supabase
    .from('quote_requests')
    .insert([{
      full_name:       request.fullName,
      email:           request.email,
      company:         request.company   || null,
      // ✅ MEJORA: phone explícitamente mapeado, nunca undefined
      phone:           request.phone     || null,
      service:         request.service,
      project_details: request.projectDetails,
      status:          'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar solicitud:', error);
    throw error;
  }

  return data.id;
};

export const updateQuoteRequest = async (id: string, request: Partial<QuoteRequest>) => {
  // ✅ MEJORA: mapeo explícito en lugar de spread + delete
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (request.fullName       !== undefined) updateData.full_name       = request.fullName;
  if (request.email          !== undefined) updateData.email            = request.email;
  if (request.company        !== undefined) updateData.company          = request.company;
  if (request.phone          !== undefined) updateData.phone            = request.phone;
  if (request.service        !== undefined) updateData.service          = request.service;
  if (request.projectDetails !== undefined) updateData.project_details  = request.projectDetails;
  if (request.status         !== undefined) updateData.status           = request.status;
  if (request.aiReport       !== undefined) updateData.ai_report        = request.aiReport;
  if (request.pdfUrl         !== undefined) updateData.pdf_url          = request.pdfUrl;

  const { error } = await supabase
    .from('quote_requests')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }
};

export const deleteQuoteRequest = async (id: string) => {
  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar solicitud:', error);
    throw error;
  }
};

// ============================================
// CONFIGURACIÓN DEL SITIO
// ============================================

// ✅ MEJORA: columnas mínimas para componentes públicos (Footer, Contact, Header…)
//    Evita traer custom_scripts u otros campos pesados innecesariamente.
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

// ============================================
// STORAGE - IMÁGENES
// ============================================

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes.`);
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 5MB`);
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error('Error de subida:', uploadError);
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const deleteImage = async (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const imagePath = pathParts.slice(pathParts.indexOf('images') + 1).join('/');

    const { error } = await supabase.storage
      .from('images')
      .remove([imagePath]);

    if (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};