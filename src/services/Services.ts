import { supabase } from "@/lib/Client";
import type { Service } from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapService(item: any): Service {
  return {
    ...item,
    longDescription: item.long_description,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  } as Service;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }

  return (data || []).map(mapService);
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const addService = async (
  service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('services')
    .insert([{
      title:            service.title,
      description:      service.description,
      long_description: service.longDescription,
      icon:             service.icon,
      image:            service.image,
      price:            service.price,
      features:         service.features,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar servicio:', error);
    throw error;
  }

  return data.id;
};

export const updateService = async (id: string, service: Partial<Service>): Promise<void> => {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (service.title            !== undefined) updateData.title            = service.title;
  if (service.description      !== undefined) updateData.description      = service.description;
  if (service.longDescription  !== undefined) updateData.long_description = service.longDescription;
  if (service.icon             !== undefined) updateData.icon             = service.icon;
  if (service.image            !== undefined) updateData.image            = service.image;
  if (service.price            !== undefined) updateData.price            = service.price;
  if (service.features         !== undefined) updateData.features         = service.features;

  const { error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar servicio:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar servicio:', error);
    throw error;
  }
};

// ─── Realtime ────────────────────────────────────────────────────────────────

export const subscribeToServices = (
  callback: (services: Service[]) => void
): (() => void) => {
  const subscription = supabase
    .channel(`services_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, async () => {
      const services = await getServices();
      callback(services);
    })
    .subscribe();

  return () => supabase.removeChannel(subscription);
};
