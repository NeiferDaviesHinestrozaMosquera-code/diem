import { supabase } from "@/lib/supabase-complete";
import type { QuoteRequest } from "@/types";

export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }

  return (data || []).map(item => ({
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
  } as QuoteRequest));
};

export const subscribeToQuoteRequests = (callback: (requests: QuoteRequest[]) => void) => {
  const subscription = supabase
    .channel(`quote_requests_changes_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, async () => {
      const requests = await getQuoteRequests();
      callback(requests);
    })
    .subscribe((status, err) => {
      if (err) console.warn('Realtime quote_requests:', status, err.message);
    });

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addQuoteRequest = async (
  request: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'aiReport' | 'pdfUrl'>
) => {
  const { data, error } = await supabase
    .from('quote_requests')
    .insert([{
      full_name:       request.fullName,
      email:           request.email,
      company:         request.company   || null,
      // ✅ MEJORA: phone explícitamente mapeado, nunca undefined
      phone:           request.phone     || null,
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

export const updateQuoteRequest = async (id: string, request: Partial<QuoteRequest>) => {
  // ✅ MEJORA: mapeo explícito en lugar de spread + delete
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (request.fullName       !== undefined) updateData.full_name       = request.fullName;
  if (request.email          !== undefined) updateData.email            = request.email;
  if (request.company        !== undefined) updateData.company          = request.company;
  if (request.phone          !== undefined) updateData.phone            = request.phone;
  if (request.service        !== undefined) updateData.service          = request.service;
  if (request.projectDetails !== undefined) updateData.project_details  = request.projectDetails;
  if (request.status         !== undefined) updateData.status           = request.status;
  if (request.aiReport       !== undefined) updateData.ai_report        = request.aiReport;
  if (request.pdfUrl         !== undefined) updateData.pdf_url          = request.pdfUrl;

  const { error } = await supabase
    .from('quote_requests')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }
};

export const deleteQuoteRequest = async (id: string) => {
  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar solicitud:', error);
    throw error;
  }
};