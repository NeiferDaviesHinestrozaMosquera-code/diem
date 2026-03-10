import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { QuoteRequest, AIReport } from '@/types';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ProcessingStatus = 'pending' | 'processed' | 'error';

export interface ProcessQuoteOptions {
  language?: 'es' | 'en';
  generatePDF?: boolean;
  uploadPDF?: boolean;
  notifyUser?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface ProcessingResult {
  success: boolean;
  quoteRequestId: string;
  aiReport?: AIReport;
  pdfUrl?: string;
  error?: string;
  timestamp: string;
}

export interface BatchProcessingResult {
  total: number;
  successful: number;
  failed: number;
  results: ProcessingResult[];
  duration: number;
}

export interface ReportServiceConfig {
  defaultLanguage: 'es' | 'en';
  autoGeneratePDF: boolean;
  autoUploadPDF: boolean;
  maxRetries: number;
  retryDelay: number;
  enableLogging: boolean;
  pdfRetentionDays: number;
}

export interface PDFMetadata {
  url: string;
  filename: string;
  size: number;
  language: 'es' | 'en';
  generatedAt: string;
  quoteRequestId: string;
}

export interface ProcessingStats {
  totalQuotes: number;
  processedQuotes: number;
  pendingQuotes: number;
  errorQuotes: number;
  averageProcessingTime: number;
  totalPDFsGenerated: number;
  totalStorageUsed: number;
}

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

export function formatCost(cost: number, language: 'es' | 'en' = 'es'): string {
  return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cost);
}

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

export function getBlobSizeMB(blob: Blob): number {
  return blob.size / (1024 * 1024);
}

export function extractFilenameFromURL(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}

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

export function translateStatus(
  status: ProcessingStatus,
  language: 'es' | 'en'
): string {
  if (language === 'en') {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  const translations: Record<string, string> = {
    pending:   'Pendiente',
    processed: 'Procesado',
    error:     'Error',
  };
  return translations[status] || status;
}

export function calculateQuoteStats(quotes: QuoteRequest[]): ProcessingStats {
  const processed = quotes.filter(q => q.status === 'processed');
  const pending   = quotes.filter(q => q.status === 'pending');
  const errors    = quotes.filter(q => q.status === 'error');
  const withPDF   = quotes.filter(q => q.pdfUrl);

  return {
    totalQuotes: quotes.length,
    processedQuotes: processed.length,
    pendingQuotes: pending.length,
    errorQuotes: errors.length,
    averageProcessingTime: 0,
    totalPDFsGenerated: withPDF.length,
    totalStorageUsed: 0,
  };
}

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

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isReadyForPDF(quoteRequest: QuoteRequest): boolean {
  return (
    validateQuoteRequest(quoteRequest) &&
    quoteRequest.aiReport !== undefined &&
    validateAIReport(quoteRequest.aiReport)
  );
}

export function estimateBatchTime(
  remainingItems: number,
  averageTimePerItem: number
): string {
  const totalSeconds = Math.ceil((remainingItems * averageTimePerItem) / 1000);
  if (totalSeconds < 60) return `${totalSeconds} segundos`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function groupQuotesByService(
  quotes: QuoteRequest[]
): Record<string, QuoteRequest[]> {
  return quotes.reduce((acc, quote) => {
    if (!acc[quote.service]) acc[quote.service] = [];
    acc[quote.service].push(quote);
    return acc;
  }, {} as Record<string, QuoteRequest[]>);
}

export function groupQuotesByStatus(
  quotes: QuoteRequest[]
): Record<ProcessingStatus, QuoteRequest[]> {
  return quotes.reduce((acc, quote) => {
    const status = quote.status as ProcessingStatus;
    if (!acc[status]) acc[status] = [];
    acc[status].push(quote);
    return acc;
  }, {} as Record<ProcessingStatus, QuoteRequest[]>);
}

export function filterOldQuotes(
  quotes: QuoteRequest[],
  daysOld: number
): QuoteRequest[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  return quotes.filter(quote => new Date(quote.createdAt) < cutoffDate);
}

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
      if (attempt === maxRetries) throw error;
      if (onRetry && error instanceof Error) onRetry(attempt, error);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function promiseAllWithLimit<T>(
  promises: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  for (const promise of promises) {
    const p = promise().then(result => { results.push(result); });
    executing.push(p);
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(e => e === p), 1);
    }
  }
  await Promise.all(executing);
  return results;
}

export const DEFAULT_CONFIG: ReportServiceConfig = {
  defaultLanguage: 'es',
  autoGeneratePDF: true,
  autoUploadPDF: true,
  maxRetries: 3,
  retryDelay: 2000,
  enableLogging: true,
  pdfRetentionDays: 30,
};

export const SUPPORTED_LANGUAGES    = ['es', 'en'] as const;
export const DIFFICULTY_LEVELS      = ['low', 'medium', 'high'] as const;
export const PROCESSING_STATUSES    = ['pending', 'processed', 'error'] as const;
export const MAX_PDF_SIZE_MB        = 10;
export const MAX_BATCH_SIZE         = 10;
export const DEFAULT_RETRY_DELAY    = 2000;
export const PDF_STORAGE_BUCKET     = 'reports';

export default {
  validateQuoteRequest, validateAIReport, validatePDFUrl,
  formatCost, formatDate, getBlobSizeMB, extractFilenameFromURL,
  translateDifficulty, translateStatus, calculateQuoteStats,
  generatePDFFilename, formatBytes, sanitizeFilename,
  isReadyForPDF, estimateBatchTime, groupQuotesByService,
  groupQuotesByStatus, filterOldQuotes, sortQuotesByDate,
  searchQuotes, withRetry, promiseAllWithLimit, DEFAULT_CONFIG,
};

// ── Privacy types (shared) ────────────────────────────────────────────────────

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

// ── Terms types (shared) ──────────────────────────────────────────────────────

export interface TermsItem {
  label?: string;
  desc:   string;
}

export interface TermsSection {
  id:          string;
  title:       string;
  icon_name:   string;
  color:       string;
  body_text:   string;
  items:       TermsItem[];
  order_index: number;
  active:      boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TermsMeta {
  id?:            string;
  page_title:     string;
  page_subtitle:  string;
  last_updated:   string;
  contact_email:  string;
}

export type NewTermsSection = Omit<TermsSection, 'id' | 'created_at' | 'updated_at'>;