import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { QuoteRequest, AIReport } from '@/types';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * TIPOS Y UTILIDADES ADICIONALES
 * 
 * Tipos de TypeScript y utilidades para trabajar con los servicios
 */



// ============================================
// TIPOS EXTENDIDOS
// ============================================

/**
 * Estado extendido de procesamiento
 */
export type ProcessingStatus = 'pending' | 'processing' | 'processed' | 'error' | 'archived';

/**
 * Opciones para procesar cotizaciones
 */
export interface ProcessQuoteOptions {
  language?: 'es' | 'en';
  generatePDF?: boolean;
  uploadPDF?: boolean;
  notifyUser?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Resultado del procesamiento de una cotización
 */
export interface ProcessingResult {
  success: boolean;
  quoteRequestId: string;
  aiReport?: AIReport;
  pdfUrl?: string;
  error?: string;
  timestamp: string;
}

/**
 * Resultado de procesamiento en lote
 */
export interface BatchProcessingResult {
  total: number;
  successful: number;
  failed: number;
  results: ProcessingResult[];
  duration: number; // en milisegundos
}

/**
 * Configuración del servicio de reportes
 */
export interface ReportServiceConfig {
  defaultLanguage: 'es' | 'en';
  autoGeneratePDF: boolean;
  autoUploadPDF: boolean;
  maxRetries: number;
  retryDelay: number; // en milisegundos
  enableLogging: boolean;
  pdfRetentionDays: number;
}

/**
 * Metadatos de un PDF
 */
export interface PDFMetadata {
  url: string;
  filename: string;
  size: number;
  language: 'es' | 'en';
  generatedAt: string;
  quoteRequestId: string;
}

/**
 * Estadísticas de procesamiento
 */
export interface ProcessingStats {
  totalQuotes: number;
  processedQuotes: number;
  pendingQuotes: number;
  errorQuotes: number;
  averageProcessingTime: number;
  totalPDFsGenerated: number;
  totalStorageUsed: number; // en bytes
}

// ============================================
// VALIDADORES
// ============================================

/**
 * Valida que un QuoteRequest tenga todos los campos necesarios
 */
export function validateQuoteRequest(quoteRequest: any): quoteRequest is QuoteRequest {
  return (
    typeof quoteRequest === 'object' &&
    typeof quoteRequest.id === 'string' &&
    typeof quoteRequest.fullName === 'string' &&
    typeof quoteRequest.email === 'string' &&
    typeof quoteRequest.service === 'string' &&
    typeof quoteRequest.projectDetails === 'string'
  );
}

/**
 * Valida que un AIReport tenga todos los campos necesarios
 */
export function validateAIReport(report: any): report is AIReport {
  return (
    typeof report === 'object' &&
    typeof report.estimatedTime === 'string' &&
    typeof report.difficultyLevel === 'string' &&
    typeof report.totalCost === 'number' &&
    typeof report.partialCosts === 'object' &&
    typeof report.requiredTeamMembers === 'number' &&
    Array.isArray(report.recommendedTechnologies) &&
    typeof report.language === 'string' &&
    (report.language === 'es' || report.language === 'en')
  );
}

/**
 * Valida una URL de PDF de Supabase
 */
export function validatePDFUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.pathname.includes('/storage/v1/object/public/reports/') &&
      url.endsWith('.pdf')
    );
  } catch {
    return false;
  }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Formatea un costo para mostrar
 */
export function formatCost(cost: number, language: 'es' | 'en' = 'es'): string {
  return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cost);
}

/**
 * Formatea una fecha para mostrar
 */
export function formatDate(date: Date | string, language: 'es' | 'en' = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Calcula el tamaño de un blob en MB
 */
export function getBlobSizeMB(blob: Blob): number {
  return blob.size / (1024 * 1024);
}

/**
 * Extrae el filename de una URL de Supabase Storage
 */
export function extractFilenameFromURL(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Traduce el nivel de dificultad
 */
export function translateDifficulty(
  difficulty: 'low' | 'medium' | 'high',
  language: 'es' | 'en'
): string {
  if (language === 'en') {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  const translations: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };

  return translations[difficulty] || difficulty;
}

/**
 * Traduce el estado de una cotización
 */
export function translateStatus(
  status: ProcessingStatus,
  language: 'es' | 'en'
): string {
  if (language === 'en') {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const translations: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    processed: 'Procesado',
    error: 'Error',
    archived: 'Archivado',
  };

  return translations[status] || status;
}

/**
 * Calcula estadísticas de un array de cotizaciones
 */
export function calculateQuoteStats(quotes: QuoteRequest[]): ProcessingStats {
  const processed = quotes.filter(q => q.status === 'processed');
  const pending = quotes.filter(q => q.status === 'pending');
  const errors = quotes.filter(q => q.status === 'error');
  const withPDF = quotes.filter(q => q.pdfUrl);

  return {
    totalQuotes: quotes.length,
    processedQuotes: processed.length,
    pendingQuotes: pending.length,
    errorQuotes: errors.length,
    averageProcessingTime: 0, // Calcular según logs
    totalPDFsGenerated: withPDF.length,
    totalStorageUsed: 0, // Calcular según Storage
  };
}

/**
 * Genera un nombre de archivo único para PDF
 */
export function generatePDFFilename(
  quoteRequest: QuoteRequest,
  language: 'es' | 'en'
): string {
  const timestamp = Date.now();
  const sanitizedName = quoteRequest.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `quote-report-${quoteRequest.id}-${sanitizedName}-${language}-${timestamp}.pdf`;
}

/**
 * Convierte bytes a formato legible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sanitiza un string para usar en nombres de archivo
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Verifica si una cotización está lista para generar PDF
 */
export function isReadyForPDF(quoteRequest: QuoteRequest): boolean {
  return (
    validateQuoteRequest(quoteRequest) &&
    quoteRequest.aiReport !== undefined &&
    validateAIReport(quoteRequest.aiReport)
  );
}

/**
 * Calcula el tiempo estimado restante para procesamiento en lote
 */
export function estimateBatchTime(
  remainingItems: number,
  averageTimePerItem: number
): string {
  const totalSeconds = Math.ceil((remainingItems * averageTimePerItem) / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds} segundos`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}

/**
 * Agrupa cotizaciones por servicio
 */
export function groupQuotesByService(
  quotes: QuoteRequest[]
): Record<string, QuoteRequest[]> {
  return quotes.reduce((acc, quote) => {
    if (!acc[quote.service]) {
      acc[quote.service] = [];
    }
    acc[quote.service].push(quote);
    return acc;
  }, {} as Record<string, QuoteRequest[]>);
}

/**
 * Agrupa cotizaciones por estado
 */
export function groupQuotesByStatus(
  quotes: QuoteRequest[]
): Record<ProcessingStatus, QuoteRequest[]> {
  return quotes.reduce((acc, quote) => {
    const status = quote.status as ProcessingStatus;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(quote);
    return acc;
  }, {} as Record<ProcessingStatus, QuoteRequest[]>);
}

/**
 * Filtra cotizaciones antiguas
 */
export function filterOldQuotes(
  quotes: QuoteRequest[],
  daysOld: number
): QuoteRequest[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return quotes.filter(quote => {
    const quoteDate = new Date(quote.createdAt);
    return quoteDate < cutoffDate;
  });
}

/**
 * Ordena cotizaciones por fecha
 */
export function sortQuotesByDate(
  quotes: QuoteRequest[],
  order: 'asc' | 'desc' = 'desc'
): QuoteRequest[] {
  return [...quotes].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Busca cotizaciones por texto
 */
export function searchQuotes(
  quotes: QuoteRequest[],
  searchTerm: string
): QuoteRequest[] {
  const term = searchTerm.toLowerCase();

  return quotes.filter(quote =>
    quote.fullName.toLowerCase().includes(term) ||
    quote.email.toLowerCase().includes(term) ||
    quote.service.toLowerCase().includes(term) ||
    quote.projectDetails.toLowerCase().includes(term) ||
    (quote.company && quote.company.toLowerCase().includes(term))
  );
}

// ============================================
// HELPERS DE RETRY
// ============================================

/**
 * Ejecuta una función con reintentos automáticos
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, onRetry } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      if (onRetry && error instanceof Error) {
        onRetry(attempt, error);
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Ejecuta múltiples promesas con límite de concurrencia
 */
export async function promiseAllWithLimit<T>(
  promises: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const promise of promises) {
    const p = promise().then(result => {
      results.push(result);
    });

    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(e => e === p), 1);
    }
  }

  await Promise.all(executing);
  return results;
}

// ============================================
// CONFIGURACIÓN POR DEFECTO
// ============================================

export const DEFAULT_CONFIG: ReportServiceConfig = {
  defaultLanguage: 'es',
  autoGeneratePDF: true,
  autoUploadPDF: true,
  maxRetries: 3,
  retryDelay: 2000,
  enableLogging: true,
  pdfRetentionDays: 30,
};

// ============================================
// CONSTANTES
// ============================================

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
export const DIFFICULTY_LEVELS = ['low', 'medium', 'high'] as const;
export const PROCESSING_STATUSES = ['pending', 'processing', 'processed', 'error', 'archived'] as const;
export const MAX_PDF_SIZE_MB = 10;
export const MAX_BATCH_SIZE = 10;
export const DEFAULT_RETRY_DELAY = 2000;
export const PDF_STORAGE_BUCKET = 'reports';

// ============================================
// EXPORT ALL
// ============================================

export default {
  validateQuoteRequest,
  validateAIReport,
  validatePDFUrl,
  formatCost,
  formatDate,
  getBlobSizeMB,
  extractFilenameFromURL,
  translateDifficulty,
  translateStatus,
  calculateQuoteStats,
  generatePDFFilename,
  formatBytes,
  sanitizeFilename,
  isReadyForPDF,
  estimateBatchTime,
  groupQuotesByService,
  groupQuotesByStatus,
  filterOldQuotes,
  sortQuotesByDate,
  searchQuotes,
  withRetry,
  promiseAllWithLimit,
  DEFAULT_CONFIG,
};


//// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrivacyItem {
  label?: string;
  desc:   string;
  icon?:  string;
}

export interface PrivacySection {
  id:          string;
  title:       string;
  icon_name:   string;
  color:       string;
  body_text:   string;
  items:       PrivacyItem[];
  order_index: number;
  active:      boolean;
  created_at:  string;
  updated_at:  string;
}

export interface PrivacyMeta {
  id:            string;
  last_updated:  string;
  page_title:    string;
  page_subtitle: string;
  contact_email: string;
  updated_at:    string;
}

export type NewPrivacySection = Omit<PrivacySection, 'id' | 'created_at' | 'updated_at'>;
