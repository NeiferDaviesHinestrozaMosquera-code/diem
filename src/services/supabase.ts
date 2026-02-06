import { supabase } from '@/lib/supabase';
import type { Service, Project, Testimonial, QuoteRequest, SiteSettings } from '@/types';

// Services
export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(item => ({
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
  
  if (error) throw error;
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
  
  if (error) throw error;
};

export const deleteService = async (id: string) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(item => ({
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
  
  if (error) throw error;
  return data.id;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const updateData: any = { ...project };
  if (project.longDescription) {
    updateData.long_description = project.longDescription;
    delete updateData.longDescription;
  }
  if (project.projectUrl) {
    updateData.project_url = project.projectUrl;
    delete updateData.projectUrl;
  }
  if (project.completionDate) {
    updateData.completion_date = project.completionDate;
    delete updateData.completionDate;
  }
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(item => ({
    ...item,
    clientName: item.client_name,
    createdAt: new Date(item.created_at),
  } as Testimonial));
};

export const subscribeToTestimonials = (callback: (testimonials: Testimonial[]) => void) => {
  const subscription = supabase
    .channel('testimonials_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, async () => {
      const testimonials = await getTestimonials();
      callback(testimonials);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      client_name: testimonial.clientName,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data.id;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
  const updateData: any = { ...testimonial };
  if (testimonial.clientName) {
    updateData.client_name = testimonial.clientName;
    delete updateData.clientName;
  }

  const { error } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Quote Requests
export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(item => ({
    ...item,
    fullName: item.full_name,
    projectDetails: item.project_details,
    aiReport: item.ai_report,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  } as QuoteRequest));
};

export const subscribeToQuoteRequests = (callback: (requests: QuoteRequest[]) => void) => {
  const subscription = supabase
    .channel('quote_requests_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, async () => {
      const requests = await getQuoteRequests();
      callback(requests);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addQuoteRequest = async (request: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  const { data, error } = await supabase
    .from('quote_requests')
    .insert([{
      full_name: request.fullName,
      email: request.email,
      company: request.company,
      phone: request.phone,
      service: request.service,
      project_details: request.projectDetails,
      status: 'pending',
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data.id;
};

export const updateQuoteRequest = async (id: string, request: Partial<QuoteRequest>) => {
  const updateData: any = { ...request };
  if (request.fullName) {
    updateData.full_name = request.fullName;
    delete updateData.fullName;
  }
  if (request.projectDetails) {
    updateData.project_details = request.projectDetails;
    delete updateData.projectDetails;
  }
  if (request.aiReport) {
    updateData.ai_report = request.aiReport;
    delete updateData.aiReport;
  }
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('quote_requests')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteQuoteRequest = async (id: string) => {
  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Site Settings
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'site')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  if (!data) return null;

  return {
    ...data,
    siteName: data.site_name,
    heroTitle: data.hero_title,
    heroSubtitle: data.hero_subtitle,
    aboutText: data.about_text,
    servicesText: data.services_text,
    projectsText: data.projects_text,
    contactText: data.contact_text,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    accentColor: data.accent_color,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    contactAddress: data.contact_address,
    socialLinks: data.social_links,
    contactInfo: data.contact_info,
    carouselImages: data.carousel_images,
    heroImages: data.hero_images,
    servicesImages: data.services_images,
    testimonialsBackground: data.testimonials_background,
    footerText: data.footer_text,
    metaDescription: data.meta_description,
    metaKeywords: data.meta_keywords,
    googleAnalyticsId: data.google_analytics_id,
    customScripts: data.custom_scripts,
  } as SiteSettings;
};

export const subscribeToSiteSettings = (callback: (settings: SiteSettings | null) => void) => {
  const subscription = supabase
    .channel('site_settings_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings', filter: 'id=eq.site' }, async () => {
      const settings = await getSiteSettings();
      callback(settings);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  const updateData: any = { ...settings };
  // Mapping camelCase to snake_case for the DB
  const mapping: Record<string, string> = {
    siteName: 'site_name',
    heroTitle: 'hero_title',
    heroSubtitle: 'hero_subtitle',
    aboutText: 'about_text',
    servicesText: 'services_text',
    projectsText: 'projects_text',
    contactText: 'contact_text',
    primaryColor: 'primary_color',
    secondaryColor: 'secondary_color',
    accentColor: 'accent_color',
    contactEmail: 'contact_email',
    contactPhone: 'contact_phone',
    contactAddress: 'contact_address',
    socialLinks: 'social_links',
    contactInfo: 'contact_info',
    carouselImages: 'carousel_images',
    heroImages: 'hero_images',
    servicesImages: 'services_images',
    testimonialsBackground: 'testimonials_background',
    footerText: 'footer_text',
    metaDescription: 'meta_description',
    metaKeywords: 'meta_keywords',
    googleAnalyticsId: 'google_analytics_id',
    customScripts: 'custom_scripts',
  };

  Object.keys(mapping).forEach(key => {
    if (key in updateData) {
      updateData[mapping[key]] = updateData[key];
      delete updateData[key];
    }
  });
  
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 'site', ...updateData });
  
  if (error) throw error;
};

// Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteImage = async (url: string) => {
  try {
    // Extract path from public URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Assuming URL format: .../storage/v1/object/public/images/path/to/file
    const imagePath = pathParts.slice(pathParts.indexOf('images') + 1).join('/');
    
    const { error } = await supabase.storage
      .from('images')
      .remove([imagePath]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
