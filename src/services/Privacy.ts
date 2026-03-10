import { supabase } from "@/lib/Client";
import type { PrivacyMeta, PrivacySection } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────



export type NewPrivacySection = Omit<PrivacySection, 'id' | 'created_at' | 'updated_at'>;

// ─── Sections ────────────────────────────────────────────────────────────────

/**
 * Returns only active sections, sorted by order_index.
 * Used by the public-facing PrivacyPolicy page.
 */
export async function getPrivacySections(): Promise<PrivacySection[]> {
  const { data, error } = await supabase
    .from('privacy_policy_sections')   // ✅ fixed: was 'privacy_sections'
    .select('*')
    .eq('active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('❌ getPrivacySections:', error);
    throw error;
  }

  return (data ?? []) as PrivacySection[];
}

/**
 * Returns ALL sections (active + inactive), sorted by order_index.
 * Used by the admin PrivacyPolicyAdmin page.
 */
export async function getAllPrivacySections(): Promise<PrivacySection[]> {
  const { data, error } = await supabase
    .from('privacy_policy_sections')   // ✅ fixed: was 'privacy_sections'
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('❌ getAllPrivacySections:', error);
    throw error;
  }

  return (data ?? []) as PrivacySection[];
}

/**
 * Creates a new privacy section.
 */
export async function createPrivacySection(
  section: NewPrivacySection,
): Promise<PrivacySection> {
  const { data, error } = await supabase
    .from('privacy_policy_sections')   // ✅ already correct
    .insert([{ ...section, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    console.error('❌ createPrivacySection:', error);
    throw error;
  }

  return data as PrivacySection;
}

/**
 * Updates an existing privacy section by id.
 */
export async function updatePrivacySection(
  id: string,
  updates: Partial<NewPrivacySection>,
): Promise<PrivacySection> {
  const { data, error } = await supabase
    .from('privacy_policy_sections')   // ✅ already correct
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ updatePrivacySection:', error);
    throw error;
  }

  return data as PrivacySection;
}

/**
 * Deletes a privacy section by id.
 */
export async function deletePrivacySection(id: string): Promise<void> {
  const { error } = await supabase
    .from('privacy_policy_sections')   // ✅ fixed: was 'privacy_sections'
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ deletePrivacySection:', error);
    throw error;
  }
}

/**
 * Subscribes to real-time changes in privacy_policy_sections.
 * Returns a cleanup function to unsubscribe.
 */
export function subscribeToPrivacySections(
  callback: (sections: PrivacySection[]) => void,
): () => void {
  // Load initial data
  getAllPrivacySections().then(callback).catch(console.error);

  const subscription = supabase
    .channel('privacy_policy_sections_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'privacy_policy_sections' }, // ✅ fixed: was 'privacy_sections'
      async () => {
        const sections = await getAllPrivacySections();
        callback(sections);
      },
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * Returns the first row from privacy_policy_meta (singleton pattern).
 * Returns null when the table is empty.
 */
export async function getPrivacyMeta(): Promise<PrivacyMeta | null> {
  const { data, error } = await supabase
    .from('privacy_policy_meta')   // ✅ fixed: was 'privacy_meta'
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('❌ getPrivacyMeta:', error);
    throw error;
  }

  return data as PrivacyMeta | null;
}

/**
 * Updates the singleton privacy_policy_meta row.
 * If no row exists yet, it upserts one.
 */
export async function updatePrivacyMeta(
  id: string,
  updates: Partial<Omit<PrivacyMeta, 'id'>>,
): Promise<PrivacyMeta> {
  const { data, error } = await supabase
    .from('privacy_policy_meta')   // ✅ fixed: was 'privacy_meta'
    .upsert({ id, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error('❌ updatePrivacyMeta:', error);
    throw error;
  }

  return data as PrivacyMeta;
}

// ─── Default export ───────────────────────────────────────────────────────────

export default {
  getPrivacySections,
  getAllPrivacySections,
  createPrivacySection,
  updatePrivacySection,
  deletePrivacySection,
  subscribeToPrivacySections,
  getPrivacyMeta,
  updatePrivacyMeta,
};