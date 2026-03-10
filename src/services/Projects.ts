import { supabase } from "@/lib/Client";
import type { Project } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapProject(item: any): Project {
  return {
    ...item,
    longDescription: item.long_description,
    completionDate:  item.completion_date,
    projectUrl:      item.project_url,
    createdAt:       new Date(item.created_at),
    updatedAt:       new Date(item.updated_at),
  } as Project;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }

  return (data || []).map(mapProject);
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const addProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      title:           project.title,
      description:     project.description,
      long_description: project.longDescription,
      client:          project.client,
      category:        project.category,
      technologies:    project.technologies,
      images:          project.images,
      project_url:     project.projectUrl,
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

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (project.title           !== undefined) updateData.title            = project.title;
  if (project.description     !== undefined) updateData.description      = project.description;
  if (project.longDescription !== undefined) updateData.long_description = project.longDescription;
  if (project.client          !== undefined) updateData.client           = project.client;
  if (project.category        !== undefined) updateData.category         = project.category;
  if (project.technologies    !== undefined) updateData.technologies     = project.technologies;
  if (project.images          !== undefined) updateData.images           = project.images;
  if (project.projectUrl      !== undefined) updateData.project_url      = project.projectUrl;
  if (project.completionDate  !== undefined) updateData.completion_date  = project.completionDate;

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar proyecto:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar proyecto:', error);
    throw error;
  }
};

// ─── Realtime ────────────────────────────────────────────────────────────────

export const subscribeToProjects = (
  callback: (projects: Project[]) => void
): (() => void) => {
  const subscription = supabase
    .channel(`projects_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async () => {
      const projects = await getProjects();
      callback(projects);
    })
    .subscribe();

  return () => supabase.removeChannel(subscription);
};