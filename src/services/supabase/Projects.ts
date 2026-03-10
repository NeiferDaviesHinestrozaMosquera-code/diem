import { supabase } from "@/lib/supabase-complete";
import type { Project } from "@/types";

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
