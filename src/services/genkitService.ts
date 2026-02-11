// genkitService.ts - VERSIÓN ACTUALIZADA
// Usa Edge Function en lugar de llamadas directas a Gemini

import { generateAIQuoteReport } from '@/config/gemini';
import type { AIReport, QuoteRequest } from '@/types';
import { updateQuoteRequest } from './supabase';

// Estados válidos según el constraint de la base de datos
type QuoteStatus = 'pending' | 'processing' | 'completed' | 'error' | 'archived';

// Servicio para generar reportes AI usando Edge Function
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
   * Valida que el estado sea uno de los permitidos
   */
  private validateStatus(status: string): QuoteStatus {
    const validStatuses: QuoteStatus[] = ['pending', 'processing', 'completed', 'error', 'archived'];
    
    if (validStatuses.includes(status as QuoteStatus)) {
      return status as QuoteStatus;
    }
    
    console.warn(`Estado inválido: ${status}, usando 'pending' por defecto`);
    return 'pending';
  }

  /**
   * Genera un reporte AI para una solicitud de cotización
   * Ahora usa Edge Function para seguridad
   */
  async generateQuoteReport(
    quoteRequest: QuoteRequest,
    language: 'es' | 'en' = 'es'
  ): Promise<AIReport> {
    try {
      console.log(`🔄 Generando reporte AI para: ${quoteRequest.fullName}`);
      console.log(`📋 Quote ID: ${quoteRequest.id}`);
      console.log(`🌐 Idioma: ${language}`);

      // Actualizar estado a 'processing' antes de generar
      try {
        await updateQuoteRequest(quoteRequest.id, {
          status: this.validateStatus('processing'),
        });
        console.log('✅ Estado actualizado a "processing"');
      } catch (statusError) {
        console.warn('⚠️ No se pudo actualizar estado a processing:', statusError);
        // Continuar de todas formas
      }

      // Llamar a la Edge Function (seguro)
      const reportData = await generateAIQuoteReport(
        quoteRequest.id,
        quoteRequest.projectDetails,
        quoteRequest.service,
        language
      );

      const aiReport: AIReport = {
        ...reportData,
        generatedAt: reportData.generatedAt || new Date().toISOString(),
        language: reportData.language || language,
      };

      // La Edge Function ya actualiza el estado a 'completed' y guarda el reporte
      // Pero podemos verificar que se guardó correctamente
      console.log('✅ Reporte AI generado exitosamente');
      console.log(`💰 Costo total: $${aiReport.totalCost}`);
      console.log(`⏱️ Tiempo estimado: ${aiReport.estimatedTime}`);
      
      return aiReport;
    } catch (error) {
      console.error('❌ Error generando reporte AI:', error);
      
      // Actualizar el estado a error en caso de fallo
      try {
        await updateQuoteRequest(quoteRequest.id, {
          status: this.validateStatus('error'),
        });
        console.log('✅ Estado actualizado a "error"');
      } catch (updateError) {
        console.error('❌ Error actualizando estado de error:', updateError);
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
    console.log(`🔁 Regenerando reporte AI para: ${quoteRequest.fullName}`);
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
      `🌍 Traduciendo reporte AI a ${targetLanguage} para: ${quoteRequest.fullName}`
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
   * CON VALIDACIÓN para evitar errores de constraint
   */
  async updateQuoteStatus(
    quoteRequestId: string,
    status: QuoteStatus
  ): Promise<void> {
    try {
      // Validar el estado antes de actualizar
      const validStatus = this.validateStatus(status);
      
      await updateQuoteRequest(quoteRequestId, { status: validStatus });
      console.log(`✅ Estado actualizado a: ${validStatus}`);
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
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