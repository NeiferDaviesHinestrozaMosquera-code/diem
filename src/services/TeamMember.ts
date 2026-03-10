import { supabase } from "@/lib/Client";
import type { TeamMember } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapTeamMember(item: any): TeamMember {
  return {
    id:          item.id,
    name:        item.name        ?? '',
    role:        item.role        ?? '',
    bio:         item.bio         ?? '',
    image:       item.image       ?? '',
    linkedinUrl: item.linkedin_url ?? '',
    githubUrl:   item.github_url  ?? '',
    twitterUrl:  item.twitter_url ?? '',
    order:       item.order       ?? 0,
    isActive:    item.is_active   ?? true,
    createdAt:   new Date(item.created_at),
    updatedAt:   new Date(item.updated_at),
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Obtiene todos los miembros activos ordenados */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error al obtener team members:', error);
    throw error;
  }

  return (data || []).map(mapTeamMember);
};

/** Solo los activos (para el frontend público) */
export const getActiveTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error al obtener team members activos:', error);
    throw error;
  }

  return (data || []).map(mapTeamMember);
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const addTeamMember = async (
  member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([{
      name:         member.name,
      role:         member.role,
      bio:          member.bio          ?? '',
      image:        member.image        ?? '',
      linkedin_url: member.linkedinUrl  ?? '',
      github_url:   member.githubUrl    ?? '',
      twitter_url:  member.twitterUrl   ?? '',
      order:        member.order        ?? 0,
      is_active:    member.isActive     ?? true,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar team member:', error);
    throw error;
  }

  return mapTeamMember(data);
};

export const updateTeamMember = async (
  id: string,
  member: Partial<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (member.name        !== undefined) updateData.name         = member.name;
  if (member.role        !== undefined) updateData.role         = member.role;
  if (member.bio         !== undefined) updateData.bio          = member.bio;
  if (member.image       !== undefined) updateData.image        = member.image;
  if (member.linkedinUrl !== undefined) updateData.linkedin_url = member.linkedinUrl;
  if (member.githubUrl   !== undefined) updateData.github_url   = member.githubUrl;
  if (member.twitterUrl  !== undefined) updateData.twitter_url  = member.twitterUrl;
  if (member.order       !== undefined) updateData.order        = member.order;
  if (member.isActive    !== undefined) updateData.is_active    = member.isActive;

  const { error } = await supabase
    .from('team_members')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar team member:', error);
    throw error;
  }
};

/** Actualiza el orden de múltiples miembros en una sola operación */
export const reorderTeamMembers = async (
  members: { id: string; order: number }[]
): Promise<void> => {
  const updates = members.map(({ id, order }) =>
    supabase
      .from('team_members')
      .update({ order, updated_at: new Date().toISOString() })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const failed  = results.find(r => r.error);

  if (failed?.error) {
    console.error('Error al reordenar team members:', failed.error);
    throw failed.error;
  }
};

// ─── Realtime ─────────────────────────────────────────────────────────────────

export const subscribeToTeamMembers = (
  callback: (members: TeamMember[]) => void
): (() => void) => {
  const subscription = supabase
    .channel(`team_members_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, async () => {
      const members = await getTeamMembers();
      callback(members);
    })
    .subscribe((status, err) => {
      if (err) console.warn('Realtime team_members:', status, err.message);
    });

  return () => supabase.removeChannel(subscription);
};