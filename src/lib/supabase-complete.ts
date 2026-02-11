import { createClient } from '@supabase/supabase-js';
import type { QuoteRequest, AIReport } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ============================================
// TIPOS
// ============================================

type QuoteStatus = 'pending' | 'processed' | 'error' | 'archived';

interface QuoteRequestUpdate {
  aiReport?: AIReport;
  status?: QuoteStatus;
  pdfUrl?: string;
}

// ============================================
// FUNCIONES CRUD
// ============================================

/**
 * Obtiene todas las solicitudes de cotización
 */
export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching quote requests:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getQuoteRequests:', error);
    return [];
  }
}

/**
 * Obtiene una solicitud de cotización por ID
 */
export async function getQuoteRequestById(id: string): Promise<QuoteRequest | null> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quote request:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getQuoteRequestById:', error);
    return null;
  }
}

/**
 * Crea una nueva solicitud de cotización
 */
export async function createQuoteRequest(
  quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status' | 'aiReport' | 'pdfUrl'>
): Promise<QuoteRequest> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([
        {
          ...quoteData,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating quote request:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createQuoteRequest:', error);
    throw error;
  }
}

/**
 * Actualiza una solicitud de cotización existente
 */
export async function updateQuoteRequest(
  id: string,
  updates: QuoteRequestUpdate
): Promise<QuoteRequest> {
  try {
    console.log('Updating quote request:', { id, updates });

    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote request:', error);
      throw error;
    }

    console.log('Quote request updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateQuoteRequest:', error);
    throw error;
  }
}

/**
 * Elimina una solicitud de cotización
 */
export async function deleteQuoteRequest(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quote request:', error);
      throw error;
    }

    console.log('Quote request deleted successfully:', id);
  } catch (error) {
    console.error('Error in deleteQuoteRequest:', error);
    throw error;
  }
}

/**
 * Archiva una solicitud de cotización
 */
export async function archiveQuoteRequest(id: string): Promise<QuoteRequest> {
  return updateQuoteRequest(id, { status: 'archived' });
}

// ============================================
// SUSCRIPCIONES EN TIEMPO REAL
// ============================================

/**
 * Suscribe a cambios en tiempo real de las solicitudes de cotización
 */
export function subscribeToQuoteRequests(
  callback: (data: QuoteRequest[]) => void
): () => void {
  // Cargar datos iniciales
  getQuoteRequests().then(callback);

  // Configurar suscripción en tiempo real
  const subscription = supabase
    .channel('quote_requests_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_requests',
      },
      async () => {
        // Cuando hay cambios, volver a cargar todos los datos
        const data = await getQuoteRequests();
        callback(data);
      }
    )
    .subscribe();

  // Retornar función de limpieza
  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Suscribe a cambios de una solicitud específica
 */
export function subscribeToQuoteRequest(
  id: string,
  callback: (data: QuoteRequest | null) => void
): () => void {
  // Cargar datos iniciales
  getQuoteRequestById(id).then(callback);

  // Configurar suscripción en tiempo real
  const subscription = supabase
    .channel(`quote_request_${id}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_requests',
        filter: `id=eq.${id}`,
      },
      async () => {
        const data = await getQuoteRequestById(id);
        callback(data);
      }
    )
    .subscribe();

  // Retornar función de limpieza
  return () => {
    subscription.unsubscribe();
  };
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

/**
 * Filtra solicitudes por estado
 */
export async function getQuoteRequestsByStatus(
  status: QuoteStatus
): Promise<QuoteRequest[]> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching quote requests by status:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getQuoteRequestsByStatus:', error);
    return [];
  }
}

/**
 * Filtra solicitudes por servicio
 */
export async function getQuoteRequestsByService(
  service: string
): Promise<QuoteRequest[]> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('service', service)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching quote requests by service:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getQuoteRequestsByService:', error);
    return [];
  }
}

/**
 * Busca solicitudes por texto
 */
export async function searchQuoteRequests(
  searchTerm: string
): Promise<QuoteRequest[]> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .or(
        `fullName.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,service.ilike.%${searchTerm}%`
      )
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error searching quote requests:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchQuoteRequests:', error);
    return [];
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================

/**
 * Obtiene estadísticas de las solicitudes
 */
export async function getQuoteRequestStats(): Promise<{
  total: number;
  pending: number;
  processed: number;
  error: number;
  archived: number;
}> {
  try {
    const allQuotes = await getQuoteRequests();

    return {
      total: allQuotes.length,
      pending: allQuotes.filter((q) => q.status === 'pending').length,
      processed: allQuotes.filter((q) => q.status === 'processed').length,
      error: allQuotes.filter((q) => q.status === 'error').length,
      archived: allQuotes.filter((q) => q.status === 'archived').length,
    };
  } catch (error) {
    console.error('Error in getQuoteRequestStats:', error);
    return {
      total: 0,
      pending: 0,
      processed: 0,
      error: 0,
      archived: 0,
    };
  }
}

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Actualiza múltiples solicitudes
 */
export async function batchUpdateQuoteRequests(
  ids: string[],
  updates: QuoteRequestUpdate
): Promise<QuoteRequest[]> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) {
      console.error('Error in batch update:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in batchUpdateQuoteRequests:', error);
    throw error;
  }
}

/**
 * Elimina múltiples solicitudes
 */
export async function batchDeleteQuoteRequests(ids: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error in batch delete:', error);
      throw error;
    }

    console.log('Quote requests deleted successfully:', ids.length);
  } catch (error) {
    console.error('Error in batchDeleteQuoteRequests:', error);
    throw error;
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Verifica si una solicitud existe
 */
export async function quoteRequestExists(id: string): Promise<boolean> {
  const quote = await getQuoteRequestById(id);
  return quote !== null;
}

/**
 * Obtiene el conteo total de solicitudes
 */
export async function getQuoteRequestCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('quote_requests')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting count:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getQuoteRequestCount:', error);
    return 0;
  }
}

/**
 * Obtiene solicitudes paginadas
 */
export async function getQuoteRequestsPaginated(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  data: QuoteRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('quote_requests')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching paginated data:', error);
      throw error;
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  } catch (error) {
    console.error('Error in getQuoteRequestsPaginated:', error);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }
}

// ============================================
// EXPORTAR TODO
// ============================================

export default {
  supabase,
  // CRUD
  getQuoteRequests,
  getQuoteRequestById,
  createQuoteRequest,
  updateQuoteRequest,
  deleteQuoteRequest,
  archiveQuoteRequest,
  // Suscripciones
  subscribeToQuoteRequests,
  subscribeToQuoteRequest,
  // Filtros
  getQuoteRequestsByStatus,
  getQuoteRequestsByService,
  searchQuoteRequests,
  // Estadísticas
  getQuoteRequestStats,
  // Batch
  batchUpdateQuoteRequests,
  batchDeleteQuoteRequests,
  // Helpers
  quoteRequestExists,
  getQuoteRequestCount,
  getQuoteRequestsPaginated,
};