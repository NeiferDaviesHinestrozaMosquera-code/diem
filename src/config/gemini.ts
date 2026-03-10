// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

export type Language   = 'es' | 'en';
export type Difficulty = 'low' | 'medium' | 'high';

export interface AIReport {
  estimatedTime:           string;
  totalCost:               number;
  partialCosts: {
    development:       number;
    design:            number;
    testing:           number;
    deployment:        number;
    projectManagement: number;
    maintenance:       number;
  };
  difficultyLevel:         Difficulty;
  requiredTeamMembers:     number;
  recommendedTechnologies: string[];
  recommendations:         string[];
  milestones:              string[];
  additionalNotes:         string;
  generatedAt:             string;
  language:                Language;
}

// Códigos de error que puede devolver la función
export type AIErrorCode = 'RATE_LIMITED' | 'NO_KEYS' | 'INTERNAL_ERROR' | 'INVALID_RESPONSE';

export class AIReportError extends Error {
  constructor(
    message: string,
    public readonly code: AIErrorCode,
    public readonly userMessage: string
  ) {
    super(message);
    this.name = 'AIReportError';
  }
}

// ─────────────────────────────────────────────
// VALIDACIÓN
// ─────────────────────────────────────────────

function isValidAIReport(data: unknown): data is Omit<AIReport, 'generatedAt' | 'language'> {
  if (!data || typeof data !== 'object') return false;
  const r = data as Record<string, unknown>;

  const validPartialCosts =
    r.partialCosts !== null &&
    typeof r.partialCosts === 'object' &&
    ['development', 'design', 'testing', 'deployment', 'projectManagement', 'maintenance']
      .every(k => typeof (r.partialCosts as Record<string, unknown>)[k] === 'number');

  return (
    typeof r.estimatedTime       === 'string'  &&
    typeof r.totalCost           === 'number'  &&
    ['low', 'medium', 'high'].includes(r.difficultyLevel as string) &&
    typeof r.requiredTeamMembers === 'number'  &&
    Array.isArray(r.recommendedTechnologies)   &&
    Array.isArray(r.recommendations)           &&
    Array.isArray(r.milestones)                &&
    typeof r.additionalNotes     === 'string'  &&
    validPartialCosts
  );
}

// ─────────────────────────────────────────────
// MENSAJES DE ERROR POR IDIOMA
// ─────────────────────────────────────────────

function getErrorMessage(code: AIErrorCode, language: Language): string {
  const messages: Record<AIErrorCode, Record<Language, string>> = {
    RATE_LIMITED: {
      es: 'El servicio de IA está temporalmente no disponible por límite de uso. Por favor intenta de nuevo en unos minutos.',
      en: 'The AI service is temporarily unavailable due to usage limits. Please try again in a few minutes.',
    },
    NO_KEYS: {
      es: 'El servicio de IA no está configurado correctamente. Contacta al administrador.',
      en: 'The AI service is not properly configured. Please contact the administrator.',
    },
    INTERNAL_ERROR: {
      es: 'Ocurrió un error al generar el reporte. Por favor intenta de nuevo.',
      en: 'An error occurred while generating the report. Please try again.',
    },
    INVALID_RESPONSE: {
      es: 'La respuesta del servicio de IA no fue válida. Por favor intenta de nuevo.',
      en: 'The AI service returned an invalid response. Please try again.',
    },
  };

  return messages[code][language];
}

// ─────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────

/**
 * Genera un reporte AI via Supabase Edge Function.
 * La Edge Function intenta GEMINI_API_KEY → GEMINI_API_KEY2.
 *
 * - Si una key está en rate limit, la Edge Function usa la otra automáticamente.
 * - Si ambas están en rate limit, lanza AIReportError con code 'RATE_LIMITED'.
 * - Nunca usa fallback local — todos los datos vienen de Gemini.
 *
 * @throws {AIReportError} con un `userMessage` listo para mostrar al usuario.
 */
export async function generateAIQuoteReport(
  quoteRequestId: string,
  projectDetails: string,
  service: string,
  language: Language = 'es'
): Promise<AIReport> {
  let response: Response;

  try {
    response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`,
      {
        method: 'POST',                          // ✅ corregido (era OPTIONS)
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey':        import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ quoteRequestId, projectDetails, service, language }),
      }
    );
  } catch (networkErr) {
    // Error de red (sin conexión, DNS, etc.)
    throw new AIReportError(
      `Network error: ${networkErr}`,
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR', language)
    );
  }

  const data = await response.json();

  // ── Rate limit en ambas keys ─────────────────────────────
  if (response.status === 429 || data?.errorCode === 'RATE_LIMITED') {
    throw new AIReportError(
      'Both Gemini keys are rate limited',
      'RATE_LIMITED',
      getErrorMessage('RATE_LIMITED', language)
    );
  }

  // ── Error de configuración (sin keys) ───────────────────
  if (data?.errorCode === 'NO_KEYS') {
    throw new AIReportError(
      'No Gemini API keys configured',
      'NO_KEYS',
      getErrorMessage('NO_KEYS', language)
    );
  }

  // ── Cualquier otro error de la Edge Function ─────────────
  if (!response.ok || !data?.success) {
    throw new AIReportError(
      data?.error ?? `Edge Function error ${response.status}`,
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR', language)
    );
  }

  // ── Validar estructura del reporte ───────────────────────
  if (!isValidAIReport(data.aiReport)) {
    console.error('[Gemini] Respuesta inválida:', data.aiReport);
    throw new AIReportError(
      'Invalid AI report structure received',
      'INVALID_RESPONSE',
      getErrorMessage('INVALID_RESPONSE', language)
    );
  }

  return {
    ...data.aiReport,
    generatedAt: data.aiReport.generatedAt ?? new Date().toISOString(),
    language,
  };
}