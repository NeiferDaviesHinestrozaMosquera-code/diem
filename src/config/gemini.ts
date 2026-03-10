import { supabase } from '@/lib/Client';

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
    
    // Preparar el body como objeto
    const requestBody = {
      quoteRequestId,
      projectDetails,
      service,
      language,
    };

    console.log('📤 Enviando request a Edge Function...');
    
    // Llamar a la Edge Function de Supabase
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
    
    // Fallback local MEJORADO para desarrollo
    if (import.meta.env.DEV) {
      console.warn('⚠️ Usando fallback local MEJORADO (solo desarrollo)');
      return generateEnhancedFallbackReport(projectDetails, service, language);
    }
    
    throw error;
  }
}

/**
 * Analiza los detalles del proyecto para generar estimaciones más precisas
 */
function analyzeProjectComplexity(projectDetails: string): {
  complexityMultiplier: number;
  detectedFeatures: string[];
  estimatedPages: number;
} {
  const details = projectDetails.toLowerCase();
  let complexityMultiplier = 1.0;
  const detectedFeatures: string[] = [];
  let estimatedPages = 5;

  // Detectar características de complejidad
  const complexityIndicators = {
    'authentication': { multiplier: 1.2, feature: 'Sistema de autenticación y autorización' },
    'auth': { multiplier: 1.2, feature: 'Sistema de autenticación' },
    'login': { multiplier: 1.15, feature: 'Sistema de login' },
    'payment': { multiplier: 1.3, feature: 'Integración de pagos' },
    'stripe': { multiplier: 1.25, feature: 'Integración Stripe' },
    'api': { multiplier: 1.2, feature: 'Desarrollo de API REST' },
    'database': { multiplier: 1.15, feature: 'Base de datos compleja' },
    'real-time': { multiplier: 1.4, feature: 'Funcionalidades en tiempo real' },
    'realtime': { multiplier: 1.4, feature: 'Funcionalidades en tiempo real' },
    'chat': { multiplier: 1.35, feature: 'Sistema de chat' },
    'notification': { multiplier: 1.2, feature: 'Sistema de notificaciones' },
    'dashboard': { multiplier: 1.25, feature: 'Dashboard administrativo' },
    'analytics': { multiplier: 1.3, feature: 'Sistema de analytics' },
    'reporting': { multiplier: 1.2, feature: 'Generación de reportes' },
    'pdf': { multiplier: 1.15, feature: 'Generación de PDFs' },
    'export': { multiplier: 1.1, feature: 'Exportación de datos' },
    'import': { multiplier: 1.15, feature: 'Importación de datos' },
    'upload': { multiplier: 1.1, feature: 'Carga de archivos' },
    'search': { multiplier: 1.15, feature: 'Búsqueda avanzada' },
    'filter': { multiplier: 1.1, feature: 'Filtros avanzados' },
    'admin': { multiplier: 1.2, feature: 'Panel de administración' },
    'multi-language': { multiplier: 1.25, feature: 'Soporte multi-idioma' },
    'multilingual': { multiplier: 1.25, feature: 'Soporte multi-idioma' },
    'responsive': { multiplier: 1.1, feature: 'Diseño responsive' },
    'mobile': { multiplier: 1.15, feature: 'Optimización móvil' },
    'seo': { multiplier: 1.1, feature: 'Optimización SEO' },
    'email': { multiplier: 1.15, feature: 'Sistema de emails automatizados' },
    'calendar': { multiplier: 1.2, feature: 'Integración de calendario' },
    'booking': { multiplier: 1.3, feature: 'Sistema de reservas' },
    'inventory': { multiplier: 1.35, feature: 'Gestión de inventario' },
    'crm': { multiplier: 1.4, feature: 'Sistema CRM' },
    'ecommerce': { multiplier: 1.5, feature: 'Funcionalidad e-commerce completa' },
    'marketplace': { multiplier: 1.6, feature: 'Marketplace con múltiples vendedores' },
    'social': { multiplier: 1.3, feature: 'Funcionalidades sociales' },
    'ai': { multiplier: 1.5, feature: 'Integración de IA' },
    'machine learning': { multiplier: 1.6, feature: 'Machine Learning' },
    'blockchain': { multiplier: 1.7, feature: 'Integración Blockchain' },
    'video': { multiplier: 1.3, feature: 'Procesamiento de video' },
    'streaming': { multiplier: 1.4, feature: 'Streaming de contenido' },
  };

  // Detectar características
  for (const [keyword, config] of Object.entries(complexityIndicators)) {
    if (details.includes(keyword)) {
      complexityMultiplier *= config.multiplier;
      detectedFeatures.push(config.feature);
    }
  }

  // Estimar número de páginas
  const pageIndicators = ['page', 'screen', 'view', 'section', 'module'];
  pageIndicators.forEach(indicator => {
    const regex = new RegExp(`(\\d+)\\s*${indicator}`, 'gi');
    const matches = details.match(regex);
    if (matches) {
      matches.forEach(match => {
        const num = parseInt(match.match(/\d+/)?.[0] || '0');
        if (num > estimatedPages) estimatedPages = num;
      });
    }
  });

  // Ajustar por longitud del proyecto
  if (details.length > 500) complexityMultiplier *= 1.15;
  if (details.length > 1000) complexityMultiplier *= 1.25;

  return {
    complexityMultiplier: Math.min(complexityMultiplier, 3.0), // Cap at 3x
    detectedFeatures,
    estimatedPages: Math.max(estimatedPages, 3),
  };
}

/**
 * Genera recomendaciones específicas basadas en el análisis del proyecto
 */
function generateSmartRecommendations(
  service: string,
  projectDetails: string,
  language: 'es' | 'en',
  detectedFeatures: string[]
): string[] {
  const details = projectDetails.toLowerCase();
  const recommendations: string[] = [];

  if (language === 'es') {
    // Recomendaciones base
    recommendations.push(
      'Realizar un análisis detallado de requisitos antes de comenzar el desarrollo',
      'Establecer hitos claros con entregables específicos cada 2 semanas',
      'Implementar un sistema de control de versiones (Git) desde el inicio'
    );

    // Recomendaciones específicas por características detectadas
    if (details.includes('authentication') || details.includes('auth') || details.includes('login')) {
      recommendations.push(
        'Implementar autenticación de dos factores (2FA) para mayor seguridad',
        'Usar OAuth 2.0 para integración con proveedores externos (Google, Facebook, etc.)'
      );
    }

    if (details.includes('payment') || details.includes('stripe') || details.includes('ecommerce')) {
      recommendations.push(
        'Cumplir con estándares PCI DSS para manejo seguro de pagos',
        'Implementar sistema de pruebas en ambiente sandbox antes de producción',
        'Considerar múltiples pasarelas de pago para redundancia'
      );
    }

    if (details.includes('database') || details.includes('data')) {
      recommendations.push(
        'Diseñar el esquema de base de datos con normalización apropiada',
        'Implementar backups automáticos diarios con retención de 30 días',
        'Establecer índices optimizados para consultas frecuentes'
      );
    }

    if (details.includes('mobile') || details.includes('responsive')) {
      recommendations.push(
        'Seguir principios de Mobile First en el diseño',
        'Realizar pruebas en dispositivos reales, no solo emuladores',
        'Optimizar imágenes y recursos para conexiones lentas'
      );
    }

    if (details.includes('api') || details.includes('integration')) {
      recommendations.push(
        'Documentar la API usando OpenAPI/Swagger',
        'Implementar rate limiting para prevenir abuso',
        'Versionado de API desde v1 para facilitar actualizaciones futuras'
      );
    }

    if (details.includes('real-time') || details.includes('chat') || details.includes('notification')) {
      recommendations.push(
        'Usar WebSockets o Server-Sent Events para actualizaciones en tiempo real',
        'Implementar sistema de fallback para conexiones inestables',
        'Considerar servicios escalables como Pusher o Socket.io'
      );
    }

    if (detectedFeatures.length > 5) {
      recommendations.push(
        'Dividir el proyecto en fases prioritarias para entrega incremental',
        'Considerar arquitectura de microservicios para mejor escalabilidad',
        'Implementar monitoreo proactivo con alertas automáticas'
      );
    }

    // Recomendaciones de testing
    recommendations.push(
      'Implementar pruebas automatizadas (unitarias e integración) con cobertura >80%',
      'Realizar pruebas de carga antes del lanzamiento para validar escalabilidad'
    );

    // Recomendaciones de deployment
    recommendations.push(
      'Usar CI/CD para despliegues automáticos y consistentes',
      'Implementar estrategia de blue-green deployment para cero downtime'
    );

  } else { // English
    // Base recommendations
    recommendations.push(
      'Conduct detailed requirements analysis before starting development',
      'Establish clear milestones with specific deliverables every 2 weeks',
      'Implement version control system (Git) from the start'
    );

    // Feature-specific recommendations
    if (details.includes('authentication') || details.includes('auth') || details.includes('login')) {
      recommendations.push(
        'Implement two-factor authentication (2FA) for enhanced security',
        'Use OAuth 2.0 for integration with external providers (Google, Facebook, etc.)'
      );
    }

    if (details.includes('payment') || details.includes('stripe') || details.includes('ecommerce')) {
      recommendations.push(
        'Comply with PCI DSS standards for secure payment handling',
        'Implement testing in sandbox environment before production',
        'Consider multiple payment gateways for redundancy'
      );
    }

    if (details.includes('database') || details.includes('data')) {
      recommendations.push(
        'Design database schema with appropriate normalization',
        'Implement automated daily backups with 30-day retention',
        'Establish optimized indexes for frequent queries'
      );
    }

    if (details.includes('mobile') || details.includes('responsive')) {
      recommendations.push(
        'Follow Mobile First design principles',
        'Test on real devices, not just emulators',
        'Optimize images and resources for slow connections'
      );
    }

    if (details.includes('api') || details.includes('integration')) {
      recommendations.push(
        'Document API using OpenAPI/Swagger',
        'Implement rate limiting to prevent abuse',
        'API versioning from v1 to facilitate future updates'
      );
    }

    if (details.includes('real-time') || details.includes('chat') || details.includes('notification')) {
      recommendations.push(
        'Use WebSockets or Server-Sent Events for real-time updates',
        'Implement fallback system for unstable connections',
        'Consider scalable services like Pusher or Socket.io'
      );
    }

    if (detectedFeatures.length > 5) {
      recommendations.push(
        'Divide project into priority phases for incremental delivery',
        'Consider microservices architecture for better scalability',
        'Implement proactive monitoring with automated alerts'
      );
    }

    // Testing recommendations
    recommendations.push(
      'Implement automated testing (unit & integration) with >80% coverage',
      'Perform load testing before launch to validate scalability'
    );

    // Deployment recommendations
    recommendations.push(
      'Use CI/CD for automated and consistent deployments',
      'Implement blue-green deployment strategy for zero downtime'
    );
  }

  return recommendations.slice(0, 10); // Return max 10 recommendations
}

/**
 * Genera hitos detallados del proyecto
 */
function generateDetailedMilestones(
  service: string,
  estimatedWeeks: number,
  language: 'es' | 'en',
  detectedFeatures: string[]
): string[] {
  const milestones: string[] = [];
  
  if (language === 'es') {
    // Fase 1: Planificación
    milestones.push(
      `Semana 1-${Math.ceil(estimatedWeeks * 0.15)}: Análisis y Planificación - Definición de requisitos, arquitectura técnica, wireframes y planificación de sprints`
    );

    // Fase 2: Diseño
    milestones.push(
      `Semana ${Math.ceil(estimatedWeeks * 0.15) + 1}-${Math.ceil(estimatedWeeks * 0.30)}: Diseño UI/UX - Creación de mockups, sistema de diseño, prototipos interactivos y revisión con stakeholders`
    );

    // Fase 3: Desarrollo Backend
    if (detectedFeatures.some(f => f.includes('API') || f.includes('base de datos') || f.includes('autenticación'))) {
      milestones.push(
        `Semana ${Math.ceil(estimatedWeeks * 0.30) + 1}-${Math.ceil(estimatedWeeks * 0.50)}: Desarrollo Backend - Configuración de base de datos, desarrollo de APIs, implementación de autenticación y lógica de negocio`
      );
    }

    // Fase 4: Desarrollo Frontend
    milestones.push(
      `Semana ${Math.ceil(estimatedWeeks * 0.50) + 1}-${Math.ceil(estimatedWeeks * 0.75)}: Desarrollo Frontend - Implementación de componentes, integración con backend, funcionalidades interactivas y responsive design`
    );

    // Fase 5: Testing
    milestones.push(
      `Semana ${Math.ceil(estimatedWeeks * 0.75) + 1}-${Math.ceil(estimatedWeeks * 0.90)}: Testing y QA - Pruebas unitarias, de integración, de rendimiento, corrección de bugs y optimización`
    );

    // Fase 6: Deployment
    milestones.push(
      `Semana ${Math.ceil(estimatedWeeks * 0.90) + 1}-${estimatedWeeks}: Despliegue y Lanzamiento - Configuración de producción, migración de datos, capacitación de usuarios y go-live`
    );

    // Fase 7: Post-lanzamiento
    milestones.push(
      `Post-Lanzamiento: Monitoreo y Soporte - 30 días de soporte incluido, monitoreo de métricas, ajustes menores y documentación final`
    );

  } else { // English
    // Phase 1: Planning
    milestones.push(
      `Week 1-${Math.ceil(estimatedWeeks * 0.15)}: Analysis & Planning - Requirements definition, technical architecture, wireframes and sprint planning`
    );

    // Phase 2: Design
    milestones.push(
      `Week ${Math.ceil(estimatedWeeks * 0.15) + 1}-${Math.ceil(estimatedWeeks * 0.30)}: UI/UX Design - Mockup creation, design system, interactive prototypes and stakeholder review`
    );

    // Phase 3: Backend Development
    if (detectedFeatures.some(f => f.includes('API') || f.includes('database') || f.includes('authentication'))) {
      milestones.push(
        `Week ${Math.ceil(estimatedWeeks * 0.30) + 1}-${Math.ceil(estimatedWeeks * 0.50)}: Backend Development - Database setup, API development, authentication implementation and business logic`
      );
    }

    // Phase 4: Frontend Development
    milestones.push(
      `Week ${Math.ceil(estimatedWeeks * 0.50) + 1}-${Math.ceil(estimatedWeeks * 0.75)}: Frontend Development - Component implementation, backend integration, interactive features and responsive design`
    );

    // Phase 5: Testing
    milestones.push(
      `Week ${Math.ceil(estimatedWeeks * 0.75) + 1}-${Math.ceil(estimatedWeeks * 0.90)}: Testing & QA - Unit, integration, performance testing, bug fixes and optimization`
    );

    // Phase 6: Deployment
    milestones.push(
      `Week ${Math.ceil(estimatedWeeks * 0.90) + 1}-${estimatedWeeks}: Deployment & Launch - Production setup, data migration, user training and go-live`
    );

    // Phase 7: Post-launch
    milestones.push(
      `Post-Launch: Monitoring & Support - 30 days included support, metrics monitoring, minor adjustments and final documentation`
    );
  }

  return milestones;
}

/**
 * Fallback MEJORADO con análisis inteligente del proyecto
 */
function generateEnhancedFallbackReport(
  projectDetails: string,
  service: string, 
  language: 'es' | 'en'
): AIReportData & { generatedAt: string; language: string } {
  console.log('🔄 Generando reporte con fallback MEJORADO...');
  
  // Analizar complejidad del proyecto
  const analysis = analyzeProjectComplexity(projectDetails);
  console.log('📊 Análisis de complejidad:', analysis);

  // Configuraciones base por servicio
  const serviceConfigs: Record<string, { 
    baseCost: number; 
    baseWeeks: number;
    difficulty: 'low' | 'medium' | 'high'; 
    team: number; 
    techs: string[];
    description: string;
  }> = {
    'Desarrollo Web': { 
      baseCost: 8000,
      baseWeeks: 7,
      difficulty: 'medium',
      team: 3,
      techs: ['React', 'Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'TailwindCSS', 'AWS S3', 'Vercel'],
      description: 'aplicación web moderna con arquitectura escalable'
    },
    'Web Development': { 
      baseCost: 8000,
      baseWeeks: 7,
      difficulty: 'medium',
      team: 3,
      techs: ['React', 'Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'TailwindCSS', 'AWS S3', 'Vercel'],
      description: 'modern web application with scalable architecture'
    },
    'Soluciones AI & Bots': { 
      baseCost: 18000,
      baseWeeks: 10,
      difficulty: 'high',
      team: 4,
      techs: ['Python', 'LangChain', 'OpenAI API', 'Claude API', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      description: 'solución de IA avanzada con modelos de lenguaje'
    },
    'AI & Bot Solutions': { 
      baseCost: 18000,
      baseWeeks: 10,
      difficulty: 'high',
      team: 4,
      techs: ['Python', 'LangChain', 'OpenAI API', 'Claude API', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      description: 'advanced AI solution with language models'
    },
    'Desarrollo de Apps Móviles': { 
      baseCost: 14000,
      baseWeeks: 9,
      difficulty: 'medium',
      team: 3,
      techs: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'Node.js', 'MongoDB', 'Push Notifications', 'App Store/Play Store'],
      description: 'aplicación móvil multiplataforma con funcionalidad nativa'
    },
    'Mobile App Development': { 
      baseCost: 14000,
      baseWeeks: 9,
      difficulty: 'medium',
      team: 3,
      techs: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'Node.js', 'MongoDB', 'Push Notifications', 'App Store/Play Store'],
      description: 'cross-platform mobile app with native functionality'
    },
    'Soluciones E-Commerce': { 
      baseCost: 12000,
      baseWeeks: 8,
      difficulty: 'medium',
      team: 3,
      techs: ['Shopify/WooCommerce', 'React', 'Node.js', 'Stripe', 'PayPal', 'PostgreSQL', 'Redis Cache', 'SendGrid'],
      description: 'plataforma e-commerce completa con pasarela de pagos'
    },
    'E-Commerce Solutions': { 
      baseCost: 12000,
      baseWeeks: 8,
      difficulty: 'medium',
      team: 3,
      techs: ['Shopify/WooCommerce', 'React', 'Node.js', 'Stripe', 'PayPal', 'PostgreSQL', 'Redis Cache', 'SendGrid'],
      description: 'complete e-commerce platform with payment gateway'
    },
    'Diseño UI/UX': { 
      baseCost: 5000,
      baseWeeks: 4,
      difficulty: 'low',
      team: 2,
      techs: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle', 'Zeplin', 'Design System'],
      description: 'diseño de interfaz y experiencia de usuario profesional'
    },
    'UI/UX Design': { 
      baseCost: 5000,
      baseWeeks: 4,
      difficulty: 'low',
      team: 2,
      techs: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle', 'Zeplin', 'Design System'],
      description: 'professional user interface and experience design'
    },
    'Servicios Cloud': { 
      baseCost: 9000,
      baseWeeks: 6,
      difficulty: 'medium',
      team: 2,
      techs: ['AWS/GCP/Azure', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Monitoring', 'CloudWatch'],
      description: 'infraestructura cloud escalable y automatizada'
    },
    'Cloud Services': { 
      baseCost: 9000,
      baseWeeks: 6,
      difficulty: 'medium',
      team: 2,
      techs: ['AWS/GCP/Azure', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Monitoring', 'CloudWatch'],
      description: 'scalable and automated cloud infrastructure'
    },
  };

  const config = serviceConfigs[service] || { 
    baseCost: 8000,
    baseWeeks: 6,
    difficulty: 'medium',
    team: 3,
    techs: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    description: language === 'es' ? 'proyecto de desarrollo de software' : 'software development project'
  };

  // Aplicar multiplicador de complejidad
  const adjustedCost = Math.round(config.baseCost * analysis.complexityMultiplier);
  const adjustedWeeks = Math.ceil(config.baseWeeks * Math.sqrt(analysis.complexityMultiplier));
  
  // Ajustar equipo según complejidad
  const adjustedTeam = analysis.complexityMultiplier > 1.5 
    ? config.team + 1 
    : analysis.complexityMultiplier > 2.0 
      ? config.team + 2 
      : config.team;

  // Ajustar dificultad
  let adjustedDifficulty: 'low' | 'medium' | 'high' = config.difficulty;
  if (analysis.complexityMultiplier > 2.0) adjustedDifficulty = 'high';
  else if (analysis.complexityMultiplier > 1.4) adjustedDifficulty = 'medium';

  // Desglose de costos más realista
  const partialCosts = {
    development: Math.round(adjustedCost * 0.45),
    design: Math.round(adjustedCost * 0.18),
    testing: Math.round(adjustedCost * 0.15),
    deployment: Math.round(adjustedCost * 0.10),
    projectManagement: Math.round(adjustedCost * 0.08),
    maintenance: Math.round(adjustedCost * 0.04),
  };

  // Generar notas adicionales detalladas
  const additionalNotes = language === 'es' 
    ? `Este ${config.description} ha sido analizado en detalle. Basándose en los requisitos proporcionados, se han identificado ${analysis.detectedFeatures.length} características clave que afectan la complejidad del proyecto: ${analysis.detectedFeatures.slice(0, 5).join(', ')}${analysis.detectedFeatures.length > 5 ? ` y ${analysis.detectedFeatures.length - 5} más` : ''}.\n\nEl proyecto se estima en aproximadamente ${analysis.estimatedPages} páginas/vistas principales, con un factor de complejidad de ${analysis.complexityMultiplier.toFixed(2)}x respecto al caso base.\n\nLa estimación incluye todas las fases del desarrollo: análisis, diseño, implementación, testing, despliegue y soporte post-lanzamiento. Los costos pueden variar ±15% dependiendo de cambios en los requisitos durante el desarrollo.\n\nSe recomienda trabajar en metodología ágil con sprints de 2 semanas para máxima flexibilidad y transparencia.`
    : `This ${config.description} has been analyzed in detail. Based on the provided requirements, ${analysis.detectedFeatures.length} key features have been identified that affect project complexity: ${analysis.detectedFeatures.slice(0, 5).join(', ')}${analysis.detectedFeatures.length > 5 ? ` and ${analysis.detectedFeatures.length - 5} more` : ''}.\n\nThe project is estimated at approximately ${analysis.estimatedPages} main pages/views, with a complexity factor of ${analysis.complexityMultiplier.toFixed(2)}x compared to the base case.\n\nThe estimate includes all development phases: analysis, design, implementation, testing, deployment, and post-launch support. Costs may vary ±15% depending on requirement changes during development.\n\nWe recommend working in agile methodology with 2-week sprints for maximum flexibility and transparency.`;

  return {
    estimatedTime: language === 'es' 
      ? `${adjustedWeeks}-${adjustedWeeks + 2} semanas`
      : `${adjustedWeeks}-${adjustedWeeks + 2} weeks`,
    totalCost: adjustedCost,
    partialCosts,
    difficultyLevel: adjustedDifficulty,
    requiredTeamMembers: adjustedTeam,
    recommendedTechnologies: config.techs,
    additionalNotes,
    recommendations: generateSmartRecommendations(service, projectDetails, language, analysis.detectedFeatures),
    milestones: generateDetailedMilestones(service, adjustedWeeks, language, analysis.detectedFeatures),
    generatedAt: new Date().toISOString(),
    language,
  };
}