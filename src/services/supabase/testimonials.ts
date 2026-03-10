import { supabase } from "@/lib/supabase-complete";
import type { Testimonial } from "@/types";

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