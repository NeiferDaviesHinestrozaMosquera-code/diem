// config/gemini.ts - VERSIÓN FINAL CORREGIDA
// Ya NO llama directamente a Gemini desde el cliente
// Ahora usa Supabase Edge Function para seguridad

import { supabase } from '@/lib/supabase-complete';

// Tipo de reporte AI
export interface AIReportData {
  estimatedTime: string;
  totalCost: number;
  partialCosts: {
    development: number;
    design: number;
    testing: number;
    deployment: number;
    projectManagement?: number;
    maintenance?: number;
  };
  difficultyLevel: 'low' | 'medium' | 'high';
  requiredTeamMembers: number;
  recommendedTechnologies: string[];
  additionalNotes: string;
  recommendations: string[];
  milestones: string[];
}

/**
 * Genera un reporte AI usando Supabase Edge Function
 * Esta función es SEGURA porque la API key está en el servidor
 */
export async function generateAIQuoteReport(
  quoteRequestId: string,
  projectDetails: string,
  service: string,
  language: 'es' | 'en' = 'es'
): Promise<AIReportData & { generatedAt: string; language: string }> {
  try {
    console.log('📡 Llamando a Edge Function para generar reporte...');
    console.log('📋 Datos:', { quoteRequestId, service, language });
    
    // Preparar el body como objeto (Supabase lo convertirá a JSON automáticamente)
    const requestBody = {
      quoteRequestId,
      projectDetails,
      service,
      language,
    };

    console.log('📤 Enviando request a Edge Function...');
    
    // Llamar a la Edge Function de Supabase
    // IMPORTANTE: NO usar JSON.stringify, Supabase lo hace automáticamente
    const { data, error } = await supabase.functions.invoke('generate-report', {
      body: requestBody,
    });

    console.log('📥 Respuesta recibida:', { data, error });

    if (error) {
      console.error('❌ Error en Edge Function:', error);
      throw error;
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Error generando reporte');
    }

    console.log('✅ Reporte generado exitosamente por Edge Function');
    return data.aiReport;
  } catch (error) {
    console.error('❌ Error generando reporte con Edge Function:', error);
    
    // Fallback local solo para desarrollo
    if (import.meta.env.DEV) {
      console.warn('⚠️ Usando fallback local (solo desarrollo)');
      return generateLocalFallbackReport(service, language);
    }
    
    throw error;
  }
}

/**
 * Fallback local SOLO para desarrollo
 * En producción, siempre debe usar la Edge Function
 */
function generateLocalFallbackReport(
  service: string, 
  language: 'es' | 'en'
): AIReportData & { generatedAt: string; language: string } {
  console.log('🔄 Generando reporte con fallback local...');
  
  const serviceConfigs: Record<string, { 
    baseCost: number; 
    time: string; 
    difficulty: 'low' | 'medium' | 'high'; 
    team: number; 
    techs: string[] 
  }> = {
    'Desarrollo Web': { 
      baseCost: 8000, 
      time: language === 'es' ? '6-8 semanas' : '6-8 weeks', 
      difficulty: 'medium',
      team: 3,
      techs: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS']
    },
    'Web Development': { 
      baseCost: 8000, 
      time: language === 'es' ? '6-8 semanas' : '6-8 weeks', 
      difficulty: 'medium',
      team: 3,
      techs: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS']
    },
    'Soluciones AI & Bots': { 
      baseCost: 15000, 
      time: language === 'es' ? '8-12 semanas' : '8-12 weeks', 
      difficulty: 'high',
      team: 4,
      techs: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI', 'Docker']
    },
    'AI & Bot Solutions': { 
      baseCost: 15000, 
      time: language === 'es' ? '8-12 semanas' : '8-12 weeks', 
      difficulty: 'high',
      team: 4,
      techs: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI', 'Docker']
    },
    'Desarrollo de Apps Móviles': { 
      baseCost: 12000, 
      time: language === 'es' ? '8-10 semanas' : '8-10 weeks', 
      difficulty: 'medium',
      team: 3,
      techs: ['React Native', 'Firebase', 'Node.js', 'MongoDB']
    },
    'Mobile App Development': { 
      baseCost: 12000, 
      time: language === 'es' ? '8-10 semanas' : '8-10 weeks', 
      difficulty: 'medium',
      team: 3,
      techs: ['React Native', 'Firebase', 'Node.js', 'MongoDB']
    },
    'Soluciones E-Commerce': { 
      baseCost: 10000, 
      time: language === 'es' ? '6-8 semanas' : '6-8 weeks', 
      difficulty: 'medium',
      team: 3,
      techs: ['Shopify', 'React', 'Node.js', 'Stripe', 'PostgreSQL']
    },
    'E-Commerce Solutions': { 
      baseCost: 10000, 
      time: language === 'es' ? '6-8 semanas' : '6-8 weeks', 
      difficulty: 'medium',
      team: 3,
      techs: ['Shopify', 'React', 'Node.js', 'Stripe', 'PostgreSQL']
    },
    'Diseño UI/UX': { 
      baseCost: 5000, 
      time: language === 'es' ? '3-4 semanas' : '3-4 weeks', 
      difficulty: 'low',
      team: 2,
      techs: ['Figma', 'Adobe XD', 'Sketch', 'InVision']
    },
    'UI/UX Design': { 
      baseCost: 5000, 
      time: language === 'es' ? '3-4 semanas' : '3-4 weeks', 
      difficulty: 'low',
      team: 2,
      techs: ['Figma', 'Adobe XD', 'Sketch', 'InVision']
    },
    'Servicios Cloud': { 
      baseCost: 7000, 
      time: language === 'es' ? '4-6 semanas' : '4-6 weeks', 
      difficulty: 'medium',
      team: 2,
      techs: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD']
    },
    'Cloud Services': { 
      baseCost: 7000, 
      time: language === 'es' ? '4-6 semanas' : '4-6 weeks', 
      difficulty: 'medium',
      team: 2,
      techs: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD']
    },
  };

  const config = serviceConfigs[service] || { 
    baseCost: 6000, 
    time: language === 'es' ? '4-6 semanas' : '4-6 weeks', 
    difficulty: 'medium',
    team: 3,
    techs: ['React', 'Node.js', 'MongoDB']
  };

  const baseCost = config.baseCost;

  return {
    estimatedTime: config.time,
    totalCost: baseCost,
    partialCosts: {
      development: Math.floor(baseCost * 0.5),
      design: Math.floor(baseCost * 0.2),
      testing: Math.floor(baseCost * 0.15),
      deployment: Math.floor(baseCost * 0.15),
      projectManagement: Math.floor(baseCost * 0.1),
      maintenance: Math.floor(baseCost * 0.05),
    },
    difficultyLevel: config.difficulty,
    requiredTeamMembers: config.team,
    recommendedTechnologies: config.techs,
    additionalNotes: language === 'es' 
      ? `Este proyecto de ${service} requiere planificación cuidadosa y comunicación regular con el cliente. Los costos pueden variar según requisitos adicionales.`
      : `This ${service} project requires careful planning and regular client communication. Costs may vary based on additional requirements.`,
    recommendations: language === 'es' ? [
      'Definir claramente los requisitos antes de comenzar',
      'Establecer puntos de revisión semanales',
      'Considerar un período de prueba antes del lanzamiento',
      'Planificar capacitación para el equipo del cliente'
    ] : [
      'Clearly define requirements before starting',
      'Establish weekly review checkpoints',
      'Consider a testing period before launch',
      'Plan training for the client team'
    ],
    milestones: language === 'es' ? [
      'Fase 1: Análisis y planificación',
      'Fase 2: Diseño y arquitectura',
      'Fase 3: Desarrollo',
      'Fase 4: Pruebas y QA',
      'Fase 5: Despliegue y lanzamiento'
    ] : [
      'Phase 1: Analysis and planning',
      'Phase 2: Design and architecture',
      'Phase 3: Development',
      'Phase 4: Testing and QA',
      'Phase 5: Deployment and launch'
    ],
    generatedAt: new Date().toISOString(),
    language,
  };
}