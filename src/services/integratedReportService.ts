import type { QuoteRequest, AIReport } from '@/types';
import { generateAIQuoteReport } from '@/config/gemini';
import { updateQuoteRequest, getQuoteRequests } from '@/lib/supabase-complete';
import { pdfService } from './pdfService';

// 🎯 Estados válidos según Supabase
type QuoteStatus = 'pending' | 'processing' | 'completed' | 'error' | 'archived';

interface ProcessOptions {
  language?: 'es' | 'en';
  generatePDF?: boolean;
  uploadPDF?: boolean;
}

interface ProcessResult {
  aiReport: AIReport;
  pdfUrl?: string;
  success: boolean;
}

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
   * 🎯 FUNCIÓN PRINCIPAL: Procesa una cotización completa
   * 
   * FLUJO:
   * 1. Cambia estado a "processing"
   * 2. Genera AI report
   * 3. GUARDA en Supabase (campo ai_report)
   * 4. CAMBIA estado a "completed"
   * 5. Genera PDF (opcional)
   * 6. Realtime notifica el cambio
   */
  async processQuoteRequest(
    quoteRequest: QuoteRequest,
    options: ProcessOptions = {}
  ): Promise<ProcessResult> {
    const { language = 'es', generatePDF = false, uploadPDF = false } = options;

    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║  🚀 PROCESAMIENTO DE COTIZACIÓN - FLUJO COMPLETO  ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(`📋 Quote ID: ${quoteRequest.id}`);
    console.log(`👤 Cliente: ${quoteRequest.fullName}`);
    console.log(`🔧 Servicio: ${quoteRequest.service}`);
    console.log(`🌍 Idioma: ${language}`);
    console.log('─────────────────────────────────────────────────────');

    try {
      // ═══════════════════════════════════════════════════════
      // PASO 1: Cambiar estado a "processing"
      // ═══════════════════════════════════════════════════════
      console.log('\n🔄 PASO 1: Actualizando estado a "processing"...');
      await updateQuoteRequest(quoteRequest.id, { status: 'processing' });
      console.log('✅ Estado actualizado a "processing"');

      // ═══════════════════════════════════════════════════════
      // PASO 2: Generar AI Report
      // ═══════════════════════════════════════════════════════
      console.log('\n📊 PASO 2: Generando AI Report...');
      
      const aiReport = await generateAIQuoteReport(
        quoteRequest.id,
        quoteRequest.projectDetails,
        quoteRequest.service,
        language
      );

      console.log('✅ AI Report generado exitosamente');
      console.log(`   💰 Costo total: $${aiReport.totalCost}`);
      console.log(`   ⏱️ Tiempo: ${aiReport.estimatedTime}`);
      console.log(`   👥 Equipo: ${aiReport.requiredTeamMembers} personas`);
      console.log(`   📈 Dificultad: ${aiReport.difficultyLevel}`);
      console.log(`   🛠️ Tecnologías: ${aiReport.recommendedTechnologies.length}`);

      // ═══════════════════════════════════════════════════════
      // PASO 3: GUARDAR en Supabase + CAMBIAR estado a "completed"
      // ═══════════════════════════════════════════════════════
      console.log('\n💾 PASO 3: Guardando en Supabase...');
      
      let pdfUrl: string | undefined = undefined;

      // Generar PDF si se solicita
      if (generatePDF && uploadPDF) {
        console.log('📄 Generando y subiendo PDF...');
        const updatedQuote = { ...quoteRequest, aiReport };
        pdfUrl = await pdfService.uploadPDFToStorage(updatedQuote, language);
        console.log(`✅ PDF generado: ${pdfUrl}`);
      }

      // 🎯 ACTUALIZACIÓN CRÍTICA: Guardar AI Report + Estado + PDF URL
      const updateData: {
        aiReport: AIReport;
        status: QuoteStatus;
        pdfUrl?: string;
      } = {
        aiReport: aiReport,
        status: 'completed', // ← Estado cambia a completado
        pdfUrl: pdfUrl,
      };

      console.log('🔄 Actualizando Supabase con:');
      console.log('   ✓ AI Report (guardado en campo ai_report)');
      console.log('   ✓ Estado → "completed"');
      if (pdfUrl) console.log(`   ✓ PDF URL → ${pdfUrl}`);

      await updateQuoteRequest(quoteRequest.id, updateData);

      console.log('✅ Supabase actualizado exitosamente');
      console.log('📡 Realtime notificará el cambio automáticamente');

      // ═══════════════════════════════════════════════════════
      // PASO 4: Confirmación Final
      // ═══════════════════════════════════════════════════════
      console.log('\n╔════════════════════════════════════════════════════╗');
      console.log('║         ✅ PROCESAMIENTO COMPLETADO               ║');
      console.log('╚════════════════════════════════════════════════════╝');
      console.log('📊 Resultados:');
      console.log(`   • AI Report: ✅ Generado y guardado`);
      console.log(`   • Estado: ✅ Actualizado a "completed"`);
      console.log(`   • PDF: ${pdfUrl ? '✅ Generado y subido' : '⏭️ No solicitado'}`);
      console.log(`   • Realtime: ✅ Sincronizado`);
      console.log('─────────────────────────────────────────────────────\n');

      return {
        aiReport,
        pdfUrl,
        success: true,
      };
    } catch (error) {
      console.error('\n╔════════════════════════════════════════════════════╗');
      console.error('║          ❌ ERROR EN PROCESAMIENTO                ║');
      console.error('╚════════════════════════════════════════════════════╝');
      console.error('Quote ID:', quoteRequest.id);
      console.error('Error:', error);
      console.error('─────────────────────────────────────────────────────\n');

      // Actualizar estado a error
      try {
        await updateQuoteRequest(quoteRequest.id, { status: 'error' });
        console.log('✅ Estado actualizado a "error"');
      } catch (updateError) {
        console.error('❌ No se pudo actualizar estado de error:', updateError);
      }

      throw error;
    }
  }

  /**
   * Regenera un reporte completo (nuevo AI + nuevo PDF)
   */
  async regenerateComplete(
    quoteRequest: QuoteRequest,
    language: 'es' | 'en' = 'es',
    uploadPDF: boolean = true
  ): Promise<ProcessResult> {
    console.log('🔄 Regenerando reporte completo...');
    console.log(`   Quote ID: ${quoteRequest.id}`);
    console.log(`   Idioma: ${language}`);

    // Eliminar PDF anterior si existe
    if (quoteRequest.pdfUrl && uploadPDF) {
      try {
        console.log('🗑️ Eliminando PDF anterior...');
        await pdfService.deletePDFFromStorage(quoteRequest.pdfUrl);
        console.log('✅ PDF anterior eliminado');
      } catch (error) {
        console.warn('⚠️ No se pudo eliminar PDF anterior:', error);
      }
    }

    return this.processQuoteRequest(quoteRequest, {
      language,
      generatePDF: true,
      uploadPDF,
    });
  }

  /**
   * Traduce un reporte existente
   */
  async generateTranslation(
    quoteRequest: QuoteRequest,
    targetLanguage: 'es' | 'en',
    uploadPDF: boolean = true
  ): Promise<ProcessResult> {
    console.log(`🌍 Generando traducción a ${targetLanguage}...`);
    console.log(`   Quote ID: ${quoteRequest.id}`);
    console.log(`   Idioma actual: ${quoteRequest.aiReport?.language || 'N/A'}`);
    console.log(`   Idioma objetivo: ${targetLanguage}`);

    return this.processQuoteRequest(quoteRequest, {
      language: targetLanguage,
      generatePDF: true,
      uploadPDF,
    });
  }

  /**
   * Solo actualiza el PDF sin regenerar el AI report
   */
  async updatePDFOnly(
    quoteRequest: QuoteRequest,
    uploadPDF: boolean = true
  ): Promise<ProcessResult> {
    if (!quoteRequest.aiReport) {
      throw new Error('No hay AI report para generar PDF');
    }

    console.log('📄 Actualizando solo el PDF...');

    try {
      const pdfUrl = await pdfService.uploadPDFToStorage(
        quoteRequest,
        quoteRequest.aiReport.language
      );

      // Actualizar solo el PDF URL
      await updateQuoteRequest(quoteRequest.id, {
        pdfUrl: pdfUrl,
      });

      console.log('✅ PDF actualizado');

      return {
        aiReport: quoteRequest.aiReport,
        pdfUrl,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error actualizando PDF:', error);
      throw error;
    }
  }

  /**
   * Procesa múltiples cotizaciones en lote
   */
  async processBatch(
    quoteRequestIds: string[],
    options: ProcessOptions = {}
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
    console.log('═══════════════════════════════════════════════════════\n');

    const results = [];
    const allQuotes = await getQuoteRequests();

    for (let i = 0; i < quoteRequestIds.length; i++) {
      const id = quoteRequestIds[i];
      console.log(`[${i + 1}/${quoteRequestIds.length}] Procesando: ${id}`);

      const quote = allQuotes.find((q) => q.id === id);

      if (!quote) {
        console.error(`❌ Cotización no encontrada: ${id}`);
        results.push({
          quoteRequestId: id,
          success: false,
          error: 'Cotización no encontrada',
        });
        continue;
      }

      try {
        const result = await this.processQuoteRequest(quote, options);
        console.log(`✅ [${i + 1}/${quoteRequestIds.length}] Completado\n`);
        results.push({
          quoteRequestId: id,
          success: true,
          ...result,
        });
      } catch (error) {
        console.error(`❌ [${i + 1}/${quoteRequestIds.length}] Error:`, error);
        results.push({
          quoteRequestId: id,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`📊 Resumen del lote: ${successful}/${results.length} exitosos`);
    console.log('═══════════════════════════════════════════════════════\n');

    return results;
  }

  /**
   * Verifica si un quote tiene reporte
   */
  hasReport(quoteRequest: QuoteRequest): boolean {
    return !!quoteRequest.aiReport;
  }

  /**
   * Obtiene el idioma del reporte actual
   */
  getReportLanguage(quoteRequest: QuoteRequest): 'es' | 'en' | null {
    return (quoteRequest.aiReport?.language as 'es' | 'en') || null;
  }

  /**
   * Archivar una cotización
   */
  async archiveQuote(quoteId: string): Promise<void> {
    console.log(`📦 Archivando cotización: ${quoteId}`);
    try {
      await updateQuoteRequest(quoteId, { status: 'archived' });
      console.log('✅ Cotización archivada exitosamente');
    } catch (error) {
      console.error('❌ Error archivando cotización:', error);
      throw error;
    }
  }

  /**
   * Desarchivar una cotización
   */
  async unarchiveQuote(quoteId: string, newStatus: 'pending' | 'completed' = 'pending'): Promise<void> {
    console.log(`📤 Desarchivando cotización: ${quoteId}`);
    try {
      await updateQuoteRequest(quoteId, { status: newStatus });
      console.log(`✅ Cotización desarchivada, nuevo estado: ${newStatus}`);
    } catch (error) {
      console.error('❌ Error desarchivando cotización:', error);
      throw error;
    }
  }

  /**
   * Verifica si una cotización está archivada
   */
  isArchived(quoteRequest: QuoteRequest): boolean {
    return quoteRequest.status === 'archived';
  }

  /**
   * Verifica si una cotización está en procesamiento
   */
  isProcessing(quoteRequest: QuoteRequest): boolean {
    return quoteRequest.status === 'processing';
  }
}

// ════════════════════════════════════════════════════════
// EXPORTAR INSTANCIA SINGLETON
// ════════════════════════════════════════════════════════

export const integratedReportService = IntegratedReportService.getInstance();

// ════════════════════════════════════════════════════════
// HOOKS DE REACT (Opcional)
// ════════════════════════════════════════════════════════

/**
 * Hook para usar en componentes React
 */
export function useQuoteProcessor() {
  const processQuote = async (
    quoteRequest: QuoteRequest,
    options?: ProcessOptions
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
    return integratedReportService.generateTranslation(
      quoteRequest,
      targetLanguage
    );
  };

  const archiveQuote = async (quoteId: string) => {
    return integratedReportService.archiveQuote(quoteId);
  };

  const unarchiveQuote = async (quoteId: string, newStatus?: 'pending' | 'completed') => {
    return integratedReportService.unarchiveQuote(quoteId, newStatus);
  };

  return {
    processQuote,
    regenerateQuote,
    translateQuote,
    archiveQuote,
    unarchiveQuote,
  };
}