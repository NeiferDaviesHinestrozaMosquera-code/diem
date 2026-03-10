import type { QuoteRequest, AIReport } from '@/types';
import { generateAIQuoteReport, AIReportError } from '@/config/gemini';
import { updateQuoteRequest, getQuoteRequestById } from '@/services/QuoteRequests';
import { pdfService } from './pdfService';
import { useState, useCallback } from 'react';

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

type Language    = 'es' | 'en';
type QuoteStatus = 'pending' | 'processed' | 'error';

export interface ProcessOptions {
  language?:    Language;
  generatePDF?: boolean;
  uploadPDF?:   boolean;
}

export interface ProcessResult {
  aiReport: AIReport;
  pdfUrl?:  string;
  success:  boolean;
}

interface BatchResult {
  quoteRequestId: string;
  success:        boolean;
  aiReport?:      AIReport;
  pdfUrl?:        string;
  error?:         string;
}

// ─────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────

async function buildAndUploadPDF(
  quote: QuoteRequest,
  aiReport: AIReport,
  language: Language
): Promise<string | undefined> {
  try {
    return await pdfService.uploadPDFToStorage({ ...quote, aiReport }, language);
  } catch (err) {
    console.error('[PDF] Error generando PDF:', err);
    return undefined;
  }
}

async function saveToSupabase(
  quoteId:  string,
  aiReport: AIReport,
  status:   QuoteStatus,
  pdfUrl?:  string
): Promise<void> {
  await updateQuoteRequest(quoteId, {
    aiReport,
    status,
    ...(pdfUrl ? { pdfUrl } : {}),
  });
}

// ─────────────────────────────────────────────
// SERVICIO PRINCIPAL
// ─────────────────────────────────────────────

export class IntegratedReportService {
  private static instance: IntegratedReportService;
  private constructor() {}

  public static getInstance(): IntegratedReportService {
    if (!IntegratedReportService.instance) {
      IntegratedReportService.instance = new IntegratedReportService();
    }
    return IntegratedReportService.instance;
  }

  /**
   * Procesa una cotización completa:
   * pending → processing → completed (o error)
   */
  async processQuoteRequest(
    quoteRequest: QuoteRequest,
    options: ProcessOptions = {}
  ): Promise<ProcessResult> {
    const { language = 'es', generatePDF = false, uploadPDF = false } = options;

    // Paso 1 — Marcar como "processing"
    await updateQuoteRequest(quoteRequest.id, { status: 'processing' });

    try {
      // Paso 2 — Generar AI Report
      const rawReport = await generateAIQuoteReport(
        quoteRequest.id,
        quoteRequest.projectDetails,
        quoteRequest.service,
        language
      );
      // Cast explícito: generateAIQuoteReport devuelve language: string,
      // pero AIReport.language es 'es' | 'en' | undefined.
      const aiReport: AIReport = { ...rawReport, language };

      // Paso 3 — Generar PDF solo si ambas flags están activas
      const pdfUrl = generatePDF && uploadPDF
        ? await buildAndUploadPDF(quoteRequest, aiReport, language)
        : undefined;

      // Paso 4 — Guardar en Supabase y marcar "completed"
      await saveToSupabase(quoteRequest.id, aiReport, 'processed', pdfUrl);

      return { aiReport, pdfUrl, success: true };

    } catch (error) {
      // Si el error es por rate limit o AI no disponible → volver a "pending"
      // para que el admin pueda procesarlo manualmente más tarde.
      // Cualquier otro error real → marcar como "error".
      const isAIUnavailable =
        error instanceof AIReportError &&
        (error.code === 'RATE_LIMITED' || error.code === 'NO_KEYS');

      const fallbackStatus: QuoteStatus = isAIUnavailable ? 'pending' : 'error';
      await updateQuoteRequest(quoteRequest.id, { status: fallbackStatus }).catch(() => {});
      throw error;
    }
  }

  /**
   * Regenera AI report + PDF, eliminando el PDF anterior si existe.
   */
  async regenerateComplete(
    quoteRequest: QuoteRequest,
    language: Language = 'es',
    uploadPDF = true
  ): Promise<ProcessResult> {
    if (quoteRequest.pdfUrl && uploadPDF) {
      await pdfService.deletePDFFromStorage(quoteRequest.pdfUrl).catch(() => {});
    }

    return this.processQuoteRequest(quoteRequest, {
      language,
      generatePDF: true,
      uploadPDF,
    });
  }

  /**
   * Genera el reporte en otro idioma SIN sobreescribir el original en Supabase.
   * El componente decide qué hacer con el resultado.
   */
  async generateTranslation(
    quoteRequest: QuoteRequest,
    targetLanguage: Language,
    uploadPDF = false
  ): Promise<ProcessResult> {
    const rawReport = await generateAIQuoteReport(
      quoteRequest.id,
      quoteRequest.projectDetails,
      quoteRequest.service,
      targetLanguage
    );
    const aiReport: AIReport = { ...rawReport, language: targetLanguage };

    const pdfUrl = uploadPDF
      ? await buildAndUploadPDF(quoteRequest, aiReport, targetLanguage)
      : undefined;

    // No persiste en Supabase — preserva el reporte original
    return { aiReport, pdfUrl, success: true };
  }

  /**
   * Actualiza solo el PDF de un quote que ya tiene AI report.
   * CORREGIDO: respeta el parámetro uploadPDF (antes se ignoraba).
   */
  async updatePDFOnly(
    quoteRequest: QuoteRequest,
    uploadPDF = true
  ): Promise<ProcessResult> {
    if (!quoteRequest.aiReport) {
      throw new Error('No hay AI report disponible para generar el PDF.');
    }

    const language = (quoteRequest.aiReport.language as Language) ?? 'es';

    const pdfUrl = uploadPDF
      ? await buildAndUploadPDF(quoteRequest, quoteRequest.aiReport, language)
      : undefined;

    if (pdfUrl) {
      await updateQuoteRequest(quoteRequest.id, { pdfUrl });
    }

    return { aiReport: quoteRequest.aiReport, pdfUrl, success: true };
  }

  /**
   * Procesa múltiples cotizaciones en lote.
   * CORREGIDO: usa getQuoteRequestById en lugar de traer toda la tabla.
   * Controla concurrencia para no saturar la Edge Function.
   */
  async processBatch(
    quoteRequestIds: string[],
    options: ProcessOptions = {},
    concurrency = 3
  ): Promise<BatchResult[]> {
    const results: BatchResult[] = [];

    for (let i = 0; i < quoteRequestIds.length; i += concurrency) {
      const chunk = quoteRequestIds.slice(i, i + concurrency);

      const chunkResults = await Promise.allSettled(
        chunk.map(async (id): Promise<BatchResult> => {
          const quote = await getQuoteRequestById(id);

          if (!quote) {
            return { quoteRequestId: id, success: false, error: 'Cotización no encontrada' };
          }

          const result = await this.processQuoteRequest(quote, options);
          return { quoteRequestId: id, ...result };
        })
      );

      chunkResults.forEach((r, idx) => {
        if (r.status === 'fulfilled') {
          results.push(r.value);
        } else {
          results.push({
            quoteRequestId: chunk[idx],
            success: false,
            error: r.reason instanceof Error ? r.reason.message : 'Error desconocido',
          });
        }
      });
    }

    return results;
  }

  // ── Helpers de estado ───────────────────────────────────────────

  hasReport(q: QuoteRequest):    boolean          { return !!q.aiReport; }
  isArchived(q: QuoteRequest):   boolean          { return q.status === 'archived'; }
  isProcessing(q: QuoteRequest): boolean          { return q.status === 'processing'; }
  getReportLanguage(q: QuoteRequest): Language | null {
    return (q.aiReport?.language as Language) ?? null;
  }

  // ── Archivo ─────────────────────────────────────────────────────

  async archiveQuote(quoteId: string): Promise<void> {
    await updateQuoteRequest(quoteId, { status: 'archived' });
  }

  async unarchiveQuote(
    quoteId:   string,
    newStatus: 'pending' | 'processed' = 'pending'
  ): Promise<void> {
    await updateQuoteRequest(quoteId, { status: newStatus });
  }
}

// ─────────────────────────────────────────────
// SINGLETON
// ─────────────────────────────────────────────

export const integratedReportService = IntegratedReportService.getInstance();

// ─────────────────────────────────────────────
// HOOK — con estado de carga y error
// ─────────────────────────────────────────────

interface QuoteProcessorState {
  isLoading: boolean;
  error:     string | null;
}

export function useQuoteProcessor() {
  const [state, setState] = useState<QuoteProcessorState>({
    isLoading: false,
    error:     null,
  });

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await fn();
      setState({ isLoading: false, error: null });
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setState({ isLoading: false, error: msg });
      return null;
    }
  }, []);

  return {
    ...state,

    processQuote: (q: QuoteRequest, opts?: ProcessOptions) =>
      run(() => integratedReportService.processQuoteRequest(q, opts)),

    regenerateQuote: (q: QuoteRequest, lang: Language = 'es') =>
      run(() => integratedReportService.regenerateComplete(q, lang)),

    translateQuote: (q: QuoteRequest, lang: Language) =>
      run(() => integratedReportService.generateTranslation(q, lang)),

    archiveQuote: (id: string) =>
      run(() => integratedReportService.archiveQuote(id)),

    unarchiveQuote: (id: string, status?: 'pending' | 'processed') =>
      run(() => integratedReportService.unarchiveQuote(id, status)),
  };
}