// Configuración y servicio para Google Gemini API
// Usa la API REST directamente para compatibilidad con el navegador

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Prompt para generar reportes de cotización
export const generateQuotePrompt = (projectDetails: string, service: string, language: 'es' | 'en' = 'es') => {
  const isSpanish = language === 'es';
  
  return `${isSpanish ? 'Eres un experto en consultoría de proyectos de tecnología.' : 'You are a technology project consulting expert.'}

${isSpanish ? 'Analiza los siguientes detalles del proyecto y genera un informe detallado de cotización en formato JSON.' : 'Analyze the following project details and generate a detailed quote report in JSON format.'}

${isSpanish ? 'Servicio solicitado:' : 'Requested service:'} ${service}
${isSpanish ? 'Detalles del proyecto:' : 'Project details:'} ${projectDetails}

${isSpanish ? 'Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:' : 'Respond ONLY with a valid JSON object with this exact structure:'}

{
  "estimatedTime": "${isSpanish ? 'Tiempo estimado en semanas o meses' : 'Estimated time in weeks or months'}",
  "totalCost": 5000,
  "partialCosts": {
    "development": 2500,
    "design": 1000,
    "testing": 750,
    "deployment": 750,
    "projectManagement": 500,
    "maintenance": 250
  },
  "difficultyLevel": "medium",
  "requiredTeamMembers": 3,
  "recommendedTechnologies": ["React", "Node.js", "MongoDB"],
  "additionalNotes": "${isSpanish ? 'Notas importantes sobre el proyecto' : 'Important notes about the project'}",
  "recommendations": ["${isSpanish ? 'Recomendación 1' : 'Recommendation 1'}"],
  "milestones": ["${isSpanish ? 'Hito 1' : 'Milestone 1'}"]
}

${isSpanish ? 'REGLAS IMPORTANTES:' : 'IMPORTANT RULES:'}
- Responde ÚNICAMENTE con el JSON válido, sin texto adicional
- Asegúrate de que el JSON esté completo y bien formado
- Los costos deben ser realistas para el tipo de proyecto en USD
- Considera la complejidad basada en los detalles proporcionados
- La suma de partialCosts debe ser igual o cercana a totalCost
- Adapta las tecnologías recomendadas al tipo de servicio
- El difficultyLevel debe ser: low, medium, o high
- requiredTeamMembers debe ser un número entre 1 y 10`;
};

// Función para llamar a la API de Gemini
export async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('No se configuró VITE_GOOGLE_AI_API_KEY, usando respuesta simulada');
    // Simular delay para desarrollo
    await new Promise(resolve => setTimeout(resolve, 1500));
    throw new Error('API key no configurada');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error en la API de Gemini');
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  } catch (error) {
    console.error('Error llamando a Gemini API:', error);
    throw error;
  }
}

// Función para generar el reporte con Gemini
export async function generateAIQuoteReport(
  projectDetails: string, 
  service: string, 
  language: 'es' | 'en' = 'es'
): Promise<{
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
}> {
  try {
    const prompt = generateQuotePrompt(projectDetails, service, language);
    
    // Intentar llamar a la API
    let text = '';
    try {
      text = await callGeminiAPI(prompt);
    } catch (apiError) {
      console.warn('API call failed, using fallback:', apiError);
      // Fallback: generar respuesta basada en el tipo de servicio
      return generateFallbackReport(service, language);
    }

    // Extraer JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta de Gemini');
    }

    const report = JSON.parse(jsonMatch[0]);
    
    // Validar y completar campos faltantes
    return {
      estimatedTime: report.estimatedTime || (language === 'es' ? '4-6 semanas' : '4-6 weeks'),
      totalCost: report.totalCost || 5000,
      partialCosts: {
        development: report.partialCosts?.development || Math.floor(report.totalCost * 0.5),
        design: report.partialCosts?.design || Math.floor(report.totalCost * 0.2),
        testing: report.partialCosts?.testing || Math.floor(report.totalCost * 0.15),
        deployment: report.partialCosts?.deployment || Math.floor(report.totalCost * 0.15),
        projectManagement: report.partialCosts?.projectManagement || Math.floor(report.totalCost * 0.1),
        maintenance: report.partialCosts?.maintenance || Math.floor(report.totalCost * 0.05),
      },
      difficultyLevel: report.difficultyLevel || 'medium',
      requiredTeamMembers: report.requiredTeamMembers || 3,
      recommendedTechnologies: report.recommendedTechnologies || ['React', 'Node.js', 'MongoDB'],
      additionalNotes: report.additionalNotes || (language === 'es' ? 'Proyecto requiere planificación cuidadosa.' : 'Project requires careful planning.'),
      recommendations: report.recommendations || [],
      milestones: report.milestones || [],
    };
  } catch (error) {
    console.error('Error generando reporte con Gemini:', error);
    return generateFallbackReport(service, language);
  }
}

// Función de respaldo cuando la API no está disponible
function generateFallbackReport(service: string, language: 'es' | 'en'): {
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
} {
  // Valores base según el tipo de servicio
  const serviceConfigs: Record<string, { baseCost: number; time: string; difficulty: 'low' | 'medium' | 'high'; team: number; techs: string[] }> = {
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
  };
}

export const GEMINI_MODEL = 'gemini-2.0-flash';
