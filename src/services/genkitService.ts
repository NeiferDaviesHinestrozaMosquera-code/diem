import { generateAIQuoteReport, GEMINI_MODEL } from '@/config/gemini';
import type { AIReport, QuoteRequest } from '@/types';
import { updateQuoteRequest } from './supabase';

// Servicio para generar reportes AI usando Gemini
export class GenkitService {
  private static instance: GenkitService;

  private constructor() {}

  public static getInstance(): GenkitService {
    if (!GenkitService.instance) {
      GenkitService.instance = new GenkitService();
    }
    return GenkitService.instance;
  }

  /**
   * Genera un reporte AI para una solicitud de cotización
   */
  async generateQuoteReport(
    quoteRequest: QuoteRequest,
    language: 'es' | 'en' = 'es'
  ): Promise<AIReport> {
    try {
      console.log(`Generando reporte AI para: ${quoteRequest.fullName}`);
      console.log(`Modelo: ${GEMINI_MODEL}`);
      console.log(`Idioma: ${language}`);

      const reportData = await generateAIQuoteReport(
        quoteRequest.projectDetails,
        quoteRequest.service,
        language
      );

      const aiReport: AIReport = {
        ...reportData,
        generatedAt: new Date().toISOString(),
        language,
      };

      // Guardar el reporte en Supabase
      await updateQuoteRequest(quoteRequest.id, {
        aiReport,
        status: 'processed', // Actualizar el estado a procesado
      });

      console.log('Reporte AI generado y guardado exitosamente en Supabase');
      return aiReport;
    } catch (error) {
      console.error('Error generando reporte AI:', error);
      
      // Actualizar el estado a error en caso de fallo
      try {
        await updateQuoteRequest(quoteRequest.id, {
          status: 'error',
        });
      } catch (updateError) {
        console.error('Error actualizando estado de error:', updateError);
      }
      
      throw error;
    }
  }

  /**
   * Regenera un reporte AI existente
   */
  async regenerateReport(
    quoteRequest: QuoteRequest,
    language: 'es' | 'en' = 'es'
  ): Promise<AIReport> {
    console.log(`Regenerando reporte AI para: ${quoteRequest.fullName}`);
    return this.generateQuoteReport(quoteRequest, language);
  }

  /**
   * Genera un reporte en el idioma opuesto al actual
   */
  async translateReport(
    quoteRequest: QuoteRequest,
    targetLanguage: 'es' | 'en'
  ): Promise<AIReport> {
    console.log(
      `Traduciendo reporte AI a ${targetLanguage} para: ${quoteRequest.fullName}`
    );
    return this.generateQuoteReport(quoteRequest, targetLanguage);
  }

  /**
   * Verifica si una solicitud tiene un reporte AI
   */
  hasAIReport(quoteRequest: QuoteRequest): boolean {
    return !!quoteRequest.aiReport;
  }

  /**
   * Obtiene el idioma del reporte actual
   */
  getReportLanguage(quoteRequest: QuoteRequest): 'es' | 'en' | null {
    return quoteRequest.aiReport?.language || null;
  }

  /**
   * Actualiza el estado de una solicitud de cotización
   */
  async updateQuoteStatus(
    quoteRequestId: string,
    status: 'pending' | 'processed' | 'error' | 'archived'
  ): Promise<void> {
    try {
      await updateQuoteRequest(quoteRequestId, { status });
      console.log(`Estado actualizado a: ${status}`);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const genkitService = GenkitService.getInstance();

// Función helper para generar reportes
export async function generateAndSaveAIReport(
  quoteRequest: QuoteRequest,
  language: 'es' | 'en' = 'es'
): Promise<AIReport> {
  return genkitService.generateQuoteReport(quoteRequest, language);
}

// Función helper para verificar si tiene reporte
export function hasAIReport(quoteRequest: QuoteRequest): boolean {
  return genkitService.hasAIReport(quoteRequest);
}

// Función helper para obtener el idioma del reporte
export function getReportLanguage(quoteRequest: QuoteRequest): 'es' | 'en' | null {
  return genkitService.getReportLanguage(quoteRequest);
}