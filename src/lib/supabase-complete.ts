import { createClient } from '@supabase/supabase-js';
import type { QuoteRequest, AIReport } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    timeout: 10000,
  },
});

// ============================================
// TIPOS
// ============================================

// 🎯 IMPORTANTE: Estados que coinciden con el constraint de Supabase
type QuoteStatus = 'pending' | 'processed' | 'error' | 'archived';

interface QuoteRequestUpdate {
  aiReport?: AIReport;
  status?: QuoteStatus;
  pdfUrl?: string;
}

// ============================================
// MAPEO DE COLUMNAS (snake_case ↔ camelCase)
// ============================================

/**
 * Convierte de snake_case (Supabase) a camelCase (TypeScript)
 */
function mapFromDatabase(data: any): QuoteRequest {
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    company: data.company,
    phone: data.phone,
    service: data.service,
    projectDetails: data.project_details,
    status: data.status,
    aiReport: data.ai_report,
    pdfUrl: data.pdf_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Convierte de camelCase (TypeScript) a snake_case (Supabase)
 */
function mapToDatabase(data: Partial<QuoteRequest>): any {
  const mapped: any = {};
  
  if (data.fullName !== undefined) mapped.full_name = data.fullName;
  if (data.email !== undefined) mapped.email = data.email;
  if (data.company !== undefined) mapped.company = data.company;
  if (data.phone !== undefined) mapped.phone = data.phone;
  if (data.service !== undefined) mapped.service = data.service;
  if (data.projectDetails !== undefined) mapped.project_details = data.projectDetails;
  if (data.status !== undefined) mapped.status = data.status;
  if (data.aiReport !== undefined) mapped.ai_report = data.aiReport;
  if (data.pdfUrl !== undefined) mapped.pdf_url = data.pdfUrl;
  
  return mapped;
}

// ============================================
// FUNCIONES CRUD
// ============================================

/**
 * Obtiene todas las solicitudes de cotización
 */
export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    console.log('📡 Obteniendo quote requests...');
    
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching quote requests:', error);
      throw error;
    }

    console.log(`✅ ${data?.length || 0} quote requests obtenidos`);
    return (data || []).map(mapFromDatabase);
  } catch (error) {
    console.error('❌ Error in getQuoteRequests:', error);
    return [];
  }
}

/**
 * Obtiene una solicitud de cotización por ID
 */
export async function getQuoteRequestById(id: string): Promise<QuoteRequest | null> {
  try {
    console.log(`📡 Obteniendo quote request: ${id}`);
    
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching quote request:', error);
      throw error;
    }

    console.log('✅ Quote request obtenido');
    return data ? mapFromDatabase(data) : null;
  } catch (error) {
    console.error('❌ Error in getQuoteRequestById:', error);
    return null;
  }
}

/**
 * Crea una nueva solicitud de cotización
 */
export async function createQuoteRequest(
  quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'aiReport' | 'pdfUrl'>
): Promise<QuoteRequest> {
  try {
    console.log('📡 Creando nueva quote request...');
    
    const dataToInsert = {
      ...mapToDatabase(quoteData),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('quote_requests')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating quote request:', error);
      throw error;
    }

    console.log('✅ Quote request creado:', data.id);
    return mapFromDatabase(data);
  } catch (error) {
    console.error('❌ Error in createQuoteRequest:', error);
    throw error;
  }
}

/**
 * 🎯 FUNCIÓN CLAVE: Actualiza una solicitud de cotización
 * Esta función GUARDA el aiReport y CAMBIA el estado automáticamente
 */
export async function updateQuoteRequest(
  id: string,
  updates: QuoteRequestUpdate
): Promise<QuoteRequest> {
  try {
    console.log('💾 Actualizando quote request:', id);
    console.log('📋 Updates:', JSON.stringify(updates, null, 2));

    // Convertir a snake_case para Supabase
    const dataToUpdate: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.aiReport !== undefined) {
      dataToUpdate.ai_report = updates.aiReport;
      console.log('📊 Guardando AI Report en Supabase');
    }
    
    if (updates.pdfUrl !== undefined) {
      dataToUpdate.pdf_url = updates.pdfUrl;
      console.log('🔗 Guardando PDF URL en Supabase');
    }
    
    if (updates.status !== undefined) {
      dataToUpdate.status = updates.status;
      console.log(`🔄 Cambiando estado a: ${updates.status}`);
    }

    const { data, error } = await supabase
      .from('quote_requests')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating quote request:', error);
      throw error;
    }

    console.log('✅ Quote request actualizado exitosamente');
    console.log(`   Estado: ${data.status}`);
    console.log(`   AI Report: ${data.ai_report ? '✅ Guardado' : '❌ No presente'}`);
    console.log(`   PDF URL: ${data.pdf_url || 'N/A'}`);
    
    return mapFromDatabase(data);
  } catch (error) {
    console.error('❌ Error in updateQuoteRequest:', error);
    throw error;
  }
}

/**
 * Elimina una solicitud de cotización
 */
export async function deleteQuoteRequest(id: string): Promise<void> {
  try {
    console.log(`🗑️ Eliminando quote request: ${id}`);
    
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting quote request:', error);
      throw error;
    }

    console.log('✅ Quote request eliminado');
  } catch (error) {
    console.error('❌ Error in deleteQuoteRequest:', error);
    throw error;
  }
}

/**
 * Archiva una solicitud de cotización
 */
export async function archiveQuoteRequest(id: string): Promise<QuoteRequest> {
  console.log(`📦 Archivando quote request: ${id}`);
  return updateQuoteRequest(id, { status: 'archived' });
}

// ============================================
// SUSCRIPCIONES EN TIEMPO REAL
// ============================================

/**
 * 🎯 FUNCIÓN CLAVE: Suscribe a cambios en tiempo real
 * Detecta cuando se guarda un aiReport y actualiza la UI automáticamente
 */
export function subscribeToQuoteRequests(
  callback: (data: QuoteRequest[]) => void
): () => void {
  console.log('📡 Configurando suscripción Realtime...');
  
  // Cargar datos iniciales
  getQuoteRequests().then((data) => {
    console.log('✅ Datos iniciales cargados');
    callback(data);
  });

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
      async (payload) => {
        console.log('📡 Cambio detectado en Realtime:', payload.eventType);
        
        if (payload.new && 'ai_report' in payload.new) {
          console.log('📊 AI Report actualizado en tiempo real');
        }
        
        if (payload.new && 'status' in payload.new) {
          console.log(`🔄 Estado actualizado en tiempo real: ${payload.new.status}`);
        }
        
        // Recargar todos los datos
        const data = await getQuoteRequests();
        callback(data);
      }
    )
    .subscribe((status) => {
      console.log(`📡 Estado de suscripción Realtime: ${status}`);
    });

  // Retornar función de limpieza
  return () => {
    console.log('🔌 Desconectando suscripción Realtime');
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
  console.log(`📡 Suscribiendo a quote request: ${id}`);
  
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapFromDatabase);
  } catch (error) {
    console.error('❌ Error in getQuoteRequestsByStatus:', error);
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapFromDatabase);
  } catch (error) {
    console.error('❌ Error in getQuoteRequestsByService:', error);
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
        `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,service.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapFromDatabase);
  } catch (error) {
    console.error('❌ Error in searchQuoteRequests:', error);
    return [];
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================

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
    console.error('❌ Error in getQuoteRequestStats:', error);
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
 * Verifica la conexión a Supabase
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('quote_requests').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión:', error);
    return false;
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
  // Helpers
  quoteRequestExists,
  checkSupabaseConnection,
};