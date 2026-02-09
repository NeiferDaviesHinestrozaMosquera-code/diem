/**
 * SERVICIO INTEGRADO DE REPORTES AI
 * 
 * Este archivo combina genkitService y pdfService para proporcionar
 * una experiencia completa de generación, almacenamiento y gestión de reportes.
 */

import type { QuoteRequest, AIReport } from '@/types';
import { genkitService } from './genkitService';
import { pdfService } from './pdfService';
import { updateQuoteRequest, getQuoteRequests } from './supabase';

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

    try {
      console.log('=== Iniciando procesamiento de cotización ===');
      console.log(`Quote ID: ${quoteRequest.id}`);
      console.log(`Opciones:`, { language, generatePDF, uploadPDF });

      // Paso 1: Generar el reporte AI
      console.log('Paso 1: Generando reporte AI...');
      const aiReport = await genkitService.generateQuoteReport(quoteRequest, language);
      console.log('✓ Reporte AI generado exitosamente');

      let pdfUrl: string | undefined;

      // Paso 2: Generar y subir PDF si se solicita
      if (generatePDF && uploadPDF) {
        console.log('Paso 2: Generando y subiendo PDF...');
        
        // Actualizar el quoteRequest con el aiReport para generar el PDF
        const updatedQuoteRequest = {
          ...quoteRequest,
          aiReport,
        };

        pdfUrl = await pdfService.uploadPDFToStorage(updatedQuoteRequest, language);
        console.log('✓ PDF generado y subido exitosamente:', pdfUrl);

        // Guardar la URL del PDF en la base de datos
        await updateQuoteRequest(quoteRequest.id, {
          pdfUrl,
        });
        console.log('✓ URL del PDF guardada en Supabase');
      } else if (generatePDF) {
        console.log('Paso 2: Generando PDF (solo descarga local)...');
        const updatedQuoteRequest = {
          ...quoteRequest,
          aiReport,
        };
        pdfService.downloadReportPDF(updatedQuoteRequest, language);
        console.log('✓ PDF descargado localmente');
      }

      console.log('=== Procesamiento completado exitosamente ===');
      return { aiReport, pdfUrl };
    } catch (error) {
      console.error('Error en processQuoteRequest:', error);
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
    console.log('Regenerando reporte completo...');
    
    // Si existe un PDF anterior, eliminarlo
    if (quoteRequest.pdfUrl) {
      try {
        await pdfService.deletePDFFromStorage(quoteRequest.pdfUrl);
        console.log('✓ PDF anterior eliminado');
      } catch (error) {
        console.warn('Advertencia: No se pudo eliminar el PDF anterior:', error);
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
    console.log(`Generando traducción a ${targetLanguage}...`);
    
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
        console.log('✓ PDF eliminado:', url);
      } catch (error) {
        console.warn('Advertencia: No se pudo eliminar PDF:', url, error);
      }
    }
  }

  /**
   * Procesa múltiples cotizaciones en lote
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
    console.log(`Procesando ${quoteRequestIds.length} cotizaciones en lote...`);
    
    const results = [];
    const allQuoteRequests = await getQuoteRequests();

    for (const id of quoteRequestIds) {
      const quoteRequest = allQuoteRequests.find((q) => q.id === id);
      
      if (!quoteRequest) {
        results.push({
          quoteRequestId: id,
          success: false,
          error: 'Cotización no encontrada',
        });
        continue;
      }

      try {
        const result = await this.processQuoteRequest(quoteRequest, options);
        results.push({
          quoteRequestId: id,
          success: true,
          ...result,
        });
      } catch (error) {
        results.push({
          quoteRequestId: id,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    console.log(`Lote procesado: ${results.filter((r) => r.success).length}/${results.length} exitosos`);
    return results;
  }
}

// Exportar instancia singleton
export const integratedReportService = IntegratedReportService.getInstance();

// ============================================
// EJEMPLOS DE USO
// ============================================

/**
 * EJEMPLO 1: Procesar una nueva cotización con todo incluido
 */
export async function example1_ProcessNewQuote(quoteRequest: QuoteRequest) {
  const result = await integratedReportService.processQuoteRequest(quoteRequest, {
    language: 'es',
    generatePDF: true,
    uploadPDF: true,
  });

  console.log('Reporte AI:', result.aiReport);
  console.log('PDF URL:', result.pdfUrl);
}

/**
 * EJEMPLO 2: Generar solo el reporte AI (sin PDF)
 */
export async function example2_GenerateAIReportOnly(quoteRequest: QuoteRequest) {
  const result = await genkitService.generateQuoteReport(quoteRequest, 'es');
  console.log('Reporte AI generado:', result);
}

/**
 * EJEMPLO 3: Generar PDF de un reporte existente
 */
export async function example3_GeneratePDFFromExisting(quoteRequest: QuoteRequest) {
  // Verificar que tenga reporte AI
  if (!quoteRequest.aiReport) {
    throw new Error('Esta cotización no tiene reporte AI');
  }

  // Descargar PDF localmente
  pdfService.downloadReportPDF(quoteRequest, 'es');

  // O subir a Supabase Storage
  const pdfUrl = await pdfService.uploadPDFToStorage(quoteRequest, 'es');
  console.log('PDF subido:', pdfUrl);
}

/**
 * EJEMPLO 4: Regenerar reporte completo
 */
export async function example4_RegenerateComplete(quoteRequest: QuoteRequest) {
  const result = await integratedReportService.regenerateComplete(
    quoteRequest,
    'es',
    true // uploadPDF
  );

  console.log('Reporte regenerado:', result);
}

/**
 * EJEMPLO 5: Generar versión en inglés
 */
export async function example5_GenerateEnglishVersion(quoteRequest: QuoteRequest) {
  const result = await integratedReportService.generateTranslation(
    quoteRequest,
    'en',
    true // uploadPDF
  );

  console.log('Versión en inglés:', result);
}

/**
 * EJEMPLO 6: Procesar múltiples cotizaciones
 */
export async function example6_ProcessBatch(quoteRequestIds: string[]) {
  const results = await integratedReportService.processBatch(quoteRequestIds, {
    language: 'es',
    generatePDF: true,
    uploadPDF: true,
  });

  results.forEach((result) => {
    if (result.success) {
      console.log(`✓ ${result.quoteRequestId}: Procesado exitosamente`);
    } else {
      console.log(`✗ ${result.quoteRequestId}: ${result.error}`);
    }
  });
}

/**
 * EJEMPLO 7: Limpiar PDFs antiguos
 */
export async function example7_CleanupOldPDFs(quoteRequestId: string) {
  await integratedReportService.cleanupOldPDFs(quoteRequestId);
  console.log('PDFs antiguos eliminados');
}

/**
 * EJEMPLO 8: Listar todos los PDFs de una cotización
 */
export async function example8_ListAllPDFs(quoteRequestId: string) {
  const pdfUrls = await integratedReportService.getAllPDFsForQuote(quoteRequestId);
  console.log('PDFs encontrados:', pdfUrls);
}

// ============================================
// HOOKS DE REACT (OPCIONAL)
// ============================================

/**
 * Hook de React para procesar cotizaciones
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
