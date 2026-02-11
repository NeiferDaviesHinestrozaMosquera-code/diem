/**
 * SERVICIO INTEGRADO DE REPORTES AI - VERSIÓN ACTUALIZADA
 * 
 * Cambios principales:
 * - Usa Edge Function en lugar de llamadas directas a Gemini (SEGURO)
 * - Valida estados antes de actualizar en Supabase
 * - Mejor manejo de errores y logging
 */

import type { QuoteRequest, AIReport } from '@/types';
import { genkitService } from './genkitService';
import { pdfService } from './pdfService';
import { updateQuoteRequest, getQuoteRequests } from './supabase';

// Estados válidos
type QuoteStatus = 'pending' | 'processing' | 'completed' | 'error' | 'archived';

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
   * Valida que el estado sea uno de los permitidos
   */
  private validateStatus(status: string): QuoteStatus {
    const validStatuses: QuoteStatus[] = ['pending', 'processing', 'completed', 'error', 'archived'];
    
    if (validStatuses.includes(status as QuoteStatus)) {
      return status as QuoteStatus;
    }
    
    console.warn(`⚠️ Estado inválido: ${status}, usando 'pending' por defecto`);
    return 'pending';
  }

  /**
   * Flujo completo: Genera el reporte AI y opcionalmente crea y sube el PDF
   */
  async processQuoteRequest(
    quoteRequest: QuoteRequest,
    options: {
      language?: 'es' | 'en';
      generatePDF?: boolean;
      uploadPDF?: boolean;
    } = {}
  ): Promise<{
    aiReport: AIReport;
    pdfUrl?: string;
  }> {
    const { language = 'es', generatePDF = false, uploadPDF = false } = options;

    console.log('═══════════════════════════════════════════');
    console.log('🚀 INICIANDO PROCESAMIENTO DE COTIZACIÓN');
    console.log('═══════════════════════════════════════════');
    console.log(`📋 Quote ID: ${quoteRequest.id}`);
    console.log(`👤 Cliente: ${quoteRequest.fullName}`);
    console.log(`🔧 Servicio: ${quoteRequest.service}`);
    console.log(`🌐 Idioma: ${language}`);
    console.log(`📄 Generar PDF: ${generatePDF}`);
    console.log(`☁️ Subir PDF: ${uploadPDF}`);
    console.log('───────────────────────────────────────────');

    try {
      // Paso 1: Generar el reporte AI usando Edge Function
      console.log('\n📊 PASO 1: Generando reporte AI...');
      const aiReport = await genkitService.generateQuoteReport(quoteRequest, language);
      console.log('✅ Reporte AI generado exitosamente');
      console.log(`   💰 Costo: $${aiReport.totalCost}`);
      console.log(`   ⏱️ Tiempo: ${aiReport.estimatedTime}`);
      console.log(`   👥 Equipo: ${aiReport.requiredTeamMembers} personas`);
      console.log(`   📈 Dificultad: ${aiReport.difficultyLevel}`);

      let pdfUrl: string | undefined;

      // Paso 2: Generar y subir PDF si se solicita
      if (generatePDF && uploadPDF) {
        console.log('\n📄 PASO 2: Generando y subiendo PDF...');
        
        // Actualizar el quoteRequest con el aiReport para generar el PDF
        const updatedQuoteRequest = {
          ...quoteRequest,
          aiReport,
        };

        pdfUrl = await pdfService.uploadPDFToStorage(updatedQuoteRequest, language);
        console.log('✅ PDF generado y subido exitosamente');
        console.log(`   🔗 URL: ${pdfUrl}`);

        // Guardar la URL del PDF en la base de datos
        await updateQuoteRequest(quoteRequest.id, {
          pdfUrl,
        });
        console.log('✅ URL del PDF guardada en Supabase');
      } else if (generatePDF) {
        console.log('\n📄 PASO 2: Generando PDF (solo descarga local)...');
        const updatedQuoteRequest = {
          ...quoteRequest,
          aiReport,
        };
        pdfService.downloadReportPDF(updatedQuoteRequest, language);
        console.log('✅ PDF descargado localmente');
      }

      console.log('\n═══════════════════════════════════════════');
      console.log('✅ PROCESAMIENTO COMPLETADO EXITOSAMENTE');
      console.log('═══════════════════════════════════════════\n');
      
      return { aiReport, pdfUrl };
    } catch (error) {
      console.error('\n❌ ERROR EN PROCESAMIENTO');
      console.error('═══════════════════════════════════════════');
      console.error('Error:', error);
      console.error('Quote ID:', quoteRequest.id);
      console.error('═══════════════════════════════════════════\n');
      throw error;
    }
  }

  /**
   * Regenera tanto el reporte AI como el PDF
   */
  async regenerateComplete(
    quoteRequest: QuoteRequest,
    language: 'es' | 'en' = 'es',
    uploadPDF: boolean = true
  ): Promise<{
    aiReport: AIReport;
    pdfUrl?: string;
  }> {
    console.log('🔁 Regenerando reporte completo...');
    
    // Si existe un PDF anterior, eliminarlo
    if (quoteRequest.pdfUrl) {
      try {
        await pdfService.deletePDFFromStorage(quoteRequest.pdfUrl);
        console.log('✅ PDF anterior eliminado');
      } catch (error) {
        console.warn('⚠️ Advertencia: No se pudo eliminar el PDF anterior:', error);
      }
    }

    return this.processQuoteRequest(quoteRequest, {
      language,
      generatePDF: true,
      uploadPDF,
    });
  }

  /**
   * Genera una versión traducida del reporte (y PDF)
   */
  async generateTranslation(
    quoteRequest: QuoteRequest,
    targetLanguage: 'es' | 'en',
    uploadPDF: boolean = true
  ): Promise<{
    aiReport: AIReport;
    pdfUrl?: string;
  }> {
    console.log(`🌍 Generando traducción a ${targetLanguage}...`);
    
    return this.processQuoteRequest(quoteRequest, {
      language: targetLanguage,
      generatePDF: true,
      uploadPDF,
    });
  }

  /**
   * Obtiene todos los PDFs generados para una cotización
   */
  async getAllPDFsForQuote(quoteRequestId: string): Promise<string[]> {
    return pdfService.listPDFsForQuoteRequest(quoteRequestId);
  }

  /**
   * Limpia todos los PDFs antiguos de una cotización
   */
  async cleanupOldPDFs(quoteRequestId: string): Promise<void> {
    const pdfUrls = await this.getAllPDFsForQuote(quoteRequestId);
    
    for (const url of pdfUrls) {
      try {
        await pdfService.deletePDFFromStorage(url);
        console.log('✅ PDF eliminado:', url);
      } catch (error) {
        console.warn('⚠️ Advertencia: No se pudo eliminar PDF:', url, error);
      }
    }
  }

  /**
   * Procesa múltiples cotizaciones en lote
   * CON validación de estados
   */
  async processBatch(
    quoteRequestIds: string[],
    options: {
      language?: 'es' | 'en';
      generatePDF?: boolean;
      uploadPDF?: boolean;
    } = {}
  ): Promise<
    Array<{
      quoteRequestId: string;
      success: boolean;
      aiReport?: AIReport;
      pdfUrl?: string;
      error?: string;
    }>
  > {
    console.log(`\n📦 Procesando ${quoteRequestIds.length} cotizaciones en lote...`);
    console.log('═══════════════════════════════════════════\n');
    
    const results = [];
    const allQuoteRequests = await getQuoteRequests();

    for (let i = 0; i < quoteRequestIds.length; i++) {
      const id = quoteRequestIds[i];
      console.log(`[${i + 1}/${quoteRequestIds.length}] Procesando: ${id}`);
      
      const quoteRequest = allQuoteRequests.find((q) => q.id === id);
      
      if (!quoteRequest) {
        console.error(`❌ Cotización no encontrada: ${id}`);
        results.push({
          quoteRequestId: id,
          success: false,
          error: 'Cotización no encontrada',
        });
        continue;
      }

      try {
        const result = await this.processQuoteRequest(quoteRequest, options);
        console.log(`✅ Procesado exitosamente: ${id}\n`);
        results.push({
          quoteRequestId: id,
          success: true,
          ...result,
        });
      } catch (error) {
        console.error(`❌ Error procesando: ${id}`);
        console.error(error);
        results.push({
          quoteRequestId: id,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    console.log('\n═══════════════════════════════════════════');
    console.log(`📊 Lote procesado: ${successful}/${results.length} exitosos`);
    console.log('═══════════════════════════════════════════\n');
    
    return results;
  }

  /**
   * Actualiza el estado de manera segura
   */
  async updateStatus(quoteRequestId: string, status: QuoteStatus): Promise<void> {
    const validStatus = this.validateStatus(status);
    await updateQuoteRequest(quoteRequestId, { status: validStatus });
  }
}

// Exportar instancia singleton
export const integratedReportService = IntegratedReportService.getInstance();

// ============================================
// HOOKS DE REACT ACTUALIZADOS
// ============================================

/**
 * Hook de React para procesar cotizaciones de forma segura
 */
export function useQuoteProcessor() {
  const processQuote = async (
    quoteRequest: QuoteRequest,
    options?: {
      language?: 'es' | 'en';
      generatePDF?: boolean;
      uploadPDF?: boolean;
    }
  ) => {
    return integratedReportService.processQuoteRequest(quoteRequest, options);
  };

  const regenerateQuote = async (
    quoteRequest: QuoteRequest,
    language: 'es' | 'en' = 'es'
  ) => {
    return integratedReportService.regenerateComplete(quoteRequest, language);
  };

  const translateQuote = async (
    quoteRequest: QuoteRequest,
    targetLanguage: 'es' | 'en'
  ) => {
    return integratedReportService.generateTranslation(quoteRequest, targetLanguage);
  };

  return {
    processQuote,
    regenerateQuote,
    translateQuote,
  };
}