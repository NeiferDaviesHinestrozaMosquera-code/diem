import { supabase } from '@/lib/Client';
import type { NewTermsSection, TermsMeta, TermsSection } from '@/types';



// ─── Meta ─────────────────────────────────────────────────────────────────────

export const getTermsMeta = async (): Promise<TermsMeta> => {
  const { data, error } = await supabase
    .from('terms_meta')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error) {
    console.error('Error al obtener terms meta:', error);
    throw error;
  }
  return data as TermsMeta;
};

export const updateTermsMeta = async (
  meta: Partial<Omit<TermsMeta, 'id' | 'updated_at'>>
): Promise<void> => {
  const { error } = await supabase
    .from('terms_meta')
    .update(meta)
    .eq('id', 'main');

  if (error) {
    console.error('Error al actualizar terms meta:', error);
    throw error;
  }
};

// ─── Sections ─────────────────────────────────────────────────────────────────

export const getTermsSections = async (): Promise<TermsSection[]> => {
  const { data, error } = await supabase
    .from('terms_sections')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error al obtener secciones de términos:', error);
    throw error;
  }
  return (data ?? []) as TermsSection[];
};

export const getActiveTermsSections = async (): Promise<TermsSection[]> => {
  const { data, error } = await supabase
    .from('terms_sections')
    .select('*')
    .eq('active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error al obtener secciones activas:', error);
    throw error;
  }
  return (data ?? []) as TermsSection[];
};

export const addTermsSection = async (section: NewTermsSection): Promise<string> => {
  const { data, error } = await supabase
    .from('terms_sections')
    .insert([section])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar sección:', error);
    throw error;
  }
  return data.id;
};

export const updateTermsSection = async (
  id: string,
  section: Partial<NewTermsSection>
): Promise<void> => {
  const { error } = await supabase
    .from('terms_sections')
    .update(section)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar sección:', error);
    throw error;
  }
};

export const deleteTermsSection = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('terms_sections')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar sección:', error);
    throw error;
  }
};

export const reorderTermsSections = async (
  orderedIds: string[]
): Promise<void> => {
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('terms_sections')
      .update({ order_index: index + 1 })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) {
    console.error('Error al reordenar secciones:', failed.error);
    throw failed.error;
  }
};

// ─── Realtime ─────────────────────────────────────────────────────────────────

export const subscribeToTerms = (
  callback: (sections: TermsSection[]) => void
): (() => void) => {
  const subscription = supabase
    .channel(`terms_changes_${Date.now()}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'terms_sections' },
      async () => {
        const sections = await getActiveTermsSections();
        callback(sections);
      }
    )
    .subscribe((status, err) => {
      if (err) console.warn('Realtime terms:', status, err.message);
    });

  return () => supabase.removeChannel(subscription);
};