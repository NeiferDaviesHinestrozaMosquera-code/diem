import { supabase } from "@/lib/Client";
import type { Testimonial } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapTestimonial(item: any): Testimonial {
  return {
    ...item,
    clientName: item.client_name,
    createdAt:  new Date(item.created_at),
  } as Testimonial;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener testimonios:', error);
    throw error;
  }

  return (data || []).map(mapTestimonial);
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const addTestimonial = async (
  testimonial: Omit<Testimonial, 'id' | 'createdAt'>
): Promise<string> => {
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

export const updateTestimonial = async (
  id: string,
  testimonial: Partial<Testimonial>
): Promise<void> => {
  const updateData: Record<string, unknown> = {};

  if (testimonial.clientName !== undefined) updateData.client_name = testimonial.clientName;
  if (testimonial.company    !== undefined) updateData.company     = testimonial.company;
  if (testimonial.content    !== undefined) updateData.content     = testimonial.content;
  if (testimonial.rating     !== undefined) updateData.rating      = testimonial.rating;
  if (testimonial.avatar     !== undefined) updateData.avatar      = testimonial.avatar;

  const { error } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar testimonio:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar testimonio:', error);
    throw error;
  }
};

// ─── Realtime ────────────────────────────────────────────────────────────────

export const subscribeToTestimonials = (
  callback: (testimonials: Testimonial[]) => void
): (() => void) => {
  const subscription = supabase
    .channel(`testimonials_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, async () => {
      const testimonials = await getTestimonials();
      callback(testimonials);
    })
    .subscribe((status, err) => {
      if (err) console.warn('Realtime testimonials:', status, err.message);
    });

  return () => supabase.removeChannel(subscription);
};