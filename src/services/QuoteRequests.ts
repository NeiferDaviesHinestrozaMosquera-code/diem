import { supabase } from "@/lib/Client";
import type { AIReport, QuoteRequest } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuoteStatus = 'pending' | 'processing' | 'completed' | 'error' | 'archived';

export interface QuoteRequestUpdate {
  aiReport?: AIReport;
  status?:   QuoteStatus;
  pdfUrl?:   string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapQuote(item: any): QuoteRequest {
  return {
    id:             item.id,
    fullName:       item.full_name,
    email:          item.email,
    company:        item.company,
    phone:          item.phone,
    service:        item.service,
    projectDetails: item.project_details,
    status:         item.status,
    aiReport:       item.ai_report,
    pdfUrl:         item.pdf_url,
    createdAt:      new Date(item.created_at),
    updatedAt:      new Date(item.updated_at),
  } as QuoteRequest;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }

  return (data || []).map(mapQuote);
};

export const getQuoteRequestById = async (id: string): Promise<QuoteRequest | null> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener solicitud:', error);
    throw error;
  }

  return data ? mapQuote(data) : null;
};

export const getQuoteRequestsByStatus = async (
  status: QuoteStatus
): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapQuote);
};

export const getQuoteRequestsByService = async (
  service: string
): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('service', service)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapQuote);
};

export const searchQuoteRequests = async (term: string): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .or(`full_name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%,service.ilike.%${term}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapQuote);
};

export const getQuoteRequestStats = async () => {
  const all = await getQuoteRequests();
  return {
    total:     all.length,
    pending:   all.filter(q => q.status === 'pending').length,
    processed: all.filter(q => q.status === 'completed').length,
    error:     all.filter(q => q.status === 'error').length,
    archived:  all.filter(q => q.status === 'archived').length,
  };
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const addQuoteRequest = async (
  request: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'aiReport' | 'pdfUrl'>
): Promise<string> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .insert([{
      full_name:       request.fullName,
      email:           request.email,
      company:         request.company        || null,
      phone:           request.phone          || null,
      service:         request.service,
      project_details: request.projectDetails,
      status:          'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar solicitud:', error);
    throw error;
  }

  return data.id;
};

export const updateQuoteRequest = async (
  id: string,
  updates: Partial<QuoteRequest> | QuoteRequestUpdate
): Promise<QuoteRequest> => {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if ('fullName'       in updates && updates.fullName       !== undefined) updateData.full_name       = updates.fullName;
  if ('email'          in updates && updates.email          !== undefined) updateData.email            = updates.email;
  if ('company'        in updates && updates.company        !== undefined) updateData.company          = updates.company;
  if ('phone'          in updates && updates.phone          !== undefined) updateData.phone            = updates.phone;
  if ('service'        in updates && updates.service        !== undefined) updateData.service          = updates.service;
  if ('projectDetails' in updates && updates.projectDetails !== undefined) updateData.project_details  = updates.projectDetails;
  if (updates.status   !== undefined) updateData.status    = updates.status;
  if (updates.aiReport !== undefined) updateData.ai_report = updates.aiReport;
  if (updates.pdfUrl   !== undefined) updateData.pdf_url   = updates.pdfUrl;

  const { data, error } = await supabase
    .from('quote_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }

  return mapQuote(data);
};

export const deleteQuoteRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar solicitud:', error);
    throw error;
  }
};

export const archiveQuoteRequest = (id: string): Promise<QuoteRequest> =>
  updateQuoteRequest(id, { status: 'archived' });

// ─── Helpers públicos ────────────────────────────────────────────────────────

export const quoteRequestExists = async (id: string): Promise<boolean> => {
  const quote = await getQuoteRequestById(id);
  return quote !== null;
};

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('quote_requests').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
};

// ─── Realtime ─────────────────────────────────────────────────────────────────

export const subscribeToQuoteRequests = (
  callback: (requests: QuoteRequest[]) => void
): (() => void) => {
  // Carga inicial
  getQuoteRequests().then(callback);

  const subscription = supabase
    .channel(`quote_requests_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, async () => {
      const data = await getQuoteRequests();
      callback(data);
    })
    .subscribe((status, err) => {
      if (err) console.warn('Realtime quote_requests:', status, err.message);
    });

  return () => supabase.removeChannel(subscription);
};

export const subscribeToQuoteRequest = (
  id: string,
  callback: (data: QuoteRequest | null) => void
): (() => void) => {
  // Carga inicial
  getQuoteRequestById(id).then(callback);

  const subscription = supabase
    .channel(`quote_request_${id}_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'quote_requests', filter: `id=eq.${id}` },
      async () => {
        const data = await getQuoteRequestById(id);
        callback(data);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
};