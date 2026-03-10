import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ==================== ESPAÑOL ====================
const translationES = {
  // Navigation
  home: 'Inicio',
  services: 'Servicios',
  projects: 'Proyectos',
  about: 'Nosotros',
  contact: 'Contacto',
  quote: 'Cotizar',
  admin: 'Admin',

  // Hero Section
  heroTitle1: 'Transformamos Ideas en',
  heroTitle2: 'Soluciones Digitales',
  heroSubtitle: 'Potenciamos tu negocio con tecnología de vanguardia, diseño excepcional y estrategias digitales innovadoras.',
  getStarted: 'Comenzar',
  learnMore: 'Saber Más',

  // Home Page - Slides
  'slide1.title': 'Transforma Tu Presencia Digital',
  'slide1.subtitle': 'Soluciones innovadoras para negocios modernos',
  'slide1.description': 'Creamos experiencias digitales de vanguardia que impulsan el crecimiento y la participación.',

  'slide2.title': 'Soluciones Impulsadas por IA',
  'slide2.subtitle': 'Automatización inteligente para tu negocio',
  'slide2.description': 'Aprovecha el poder de la inteligencia artificial para optimizar las operaciones.',

  'slide3.title': 'Excelencia en E-Commerce',
  'slide3.subtitle': 'Construye tu imperio en línea',
  'slide3.description': 'Soluciones completas de comercio electrónico que convierten visitantes en clientes.',

  // Home - Features
  whyChooseTitle: '¿Por Qué Elegir Digital Emporium?',
  whyChooseSubtitle: 'Combinamos innovación con experiencia para ofrecer resultados excepcionales',

  'feature.webDev.title': 'Desarrollo Web',
  'feature.webDev.desc': 'Sitios web personalizados construidos con tecnologías modernas',

  'feature.ai.title': 'Soluciones IA',
  'feature.ai.desc': 'Bots inteligentes y sistemas de automatización',

  'feature.performance.title': 'Rendimiento Rápido',
  'feature.performance.desc': 'Optimizado para velocidad y escalabilidad',

  'feature.global.title': 'Alcance Global',
  'feature.global.desc': 'Soporte multiidioma e internacional',

  // Home - Stats
  'stat.projects': 'Proyectos Completados',
  'stat.clients': 'Clientes Satisfechos',
  'stat.experience': 'Años de Experiencia',
  'stat.support': 'Soporte Disponible',

  // Home - CTA
  'cta.ready': '¿Listo para iniciar tu proyecto?',
  'cta.create': 'Creemos algo increíble juntos',

  // Services
  servicesTitle: 'Nuestros Servicios',
  servicesSubtitle: 'Ofrecemos una suite completa de servicios digitales para elevar tu negocio.',
  viewDetails: 'Ver Detalles',

  // Projects
  projectsTitle: 'Nuestros Proyectos',
  projectsSubtitle: 'Descubre las soluciones innovadoras y los proyectos impactantes que hemos entregado a nuestros clientes.',
  projectsDetails: 'Ver Proyecto',

  // About
  aboutTitle: 'Sobre Nosotros',
  aboutSubtitle: 'Conoce nuestra historia y lo que nos impulsa.',
  welcomeTitle: '¡Bienvenido a Digital Emporium!',
  welcomeText: 'Somos un equipo apasionado de desarrolladores, diseñadores y especialistas en IA dedicados a crear soluciones digitales innovadoras que potencian los negocios y dan vida a las visiones creativas. Nuestra experiencia abarca el desarrollo web, la creación de aplicaciones móviles, agentes de IA personalizados y consultoría digital estratégica. Creemos en el poder transformador de la tecnología.',
  mission: 'Misión',
  vision: 'Visión',
  values: 'Valores',
  missionText: 'Proporcionar soluciones digitales excepcionales que impulsen el crecimiento y éxito de nuestros clientes mediante tecnología innovadora y un servicio excepcional.',
  visionText: 'Ser la empresa líder en soluciones digitales, reconocida por nuestra excelencia, innovación y compromiso con el éxito de nuestros clientes.',
  valuesText: 'Integridad, Innovación, Compromiso, Excelencia, Colaboración',

  // About - Values
  'values.title': 'Nuestros Valores Fundamentales',
  'values.subtitle': 'Los principios que guían todo lo que hacemos',

  'value.innovation': 'Innovación',
  'value.innovation.desc': 'Constantemente superamos límites y exploramos nuevas tecnologías para ofrecer soluciones de vanguardia.',

  'value.passion': 'Pasión',
  'value.passion.desc': 'Amamos lo que hacemos, y esa pasión se traduce en un trabajo excepcional para nuestros clientes.',

  'value.excellence': 'Excelencia',
  'value.excellence.desc': 'Mantenemos los más altos estándares en cada proyecto, asegurando calidad y atención al detalle.',

  'value.collaboration': 'Colaboración',
  'value.collaboration.desc': 'Trabajamos estrechamente con nuestros clientes, creyendo que los mejores resultados provienen del trabajo en equipo.',

  // About - Team
  'team.title': 'Conoce Nuestro Equipo',
  'team.subtitle': 'Las personas talentosas detrás de Digital Emporium',

  // About - CTA
  'about.cta.title': 'Trabajemos juntos',
  'about.cta.subtitle': '¿Listo para dar vida a tu visión?',

  // Contact
  contactTitle: 'Contáctanos',
  contactSubtitle: '¿Listo para iniciar tu proyecto? Estamos aquí para ayudarte.',
  email: 'Correo Electrónico',
  phone: 'Teléfono',
  address: 'Dirección',

  'contact.info.email.title': 'Email',
  'contact.info.email.content': 'contact@digitalemporium.com',
  'contact.info.email.desc': 'Envíanos un email en cualquier momento',

  'contact.info.phone.title': 'Teléfono',
  'contact.info.phone.content': '+1 (555) 123-4567',
  'contact.info.phone.desc': 'Lun-Vie de 8am a 5pm',

  'contact.info.address.title': 'Dirección',
  'contact.info.address.content': '123 Tech Street, San Francisco, CA 94105',
  'contact.info.address.desc': 'Visita nuestra oficina',

  'contact.hours.title': 'Horario de Atención',
  'contact.hours.weekday': 'Lunes - Viernes',
  'contact.hours.weekday.time': '8:00 AM - 6:00 PM',
  'contact.hours.saturday': 'Sábado',
  'contact.hours.saturday.time': '9:00 AM - 2:00 PM',
  'contact.hours.sunday': 'Domingo',
  'contact.hours.sunday.time': 'Cerrado',

  'contact.schedule.title': 'Programa una Llamada',
  'contact.schedule.desc': 'Agenda una consulta gratuita para discutir las necesidades de tu proyecto con nuestros expertos.',
  'contact.schedule.button': 'Reservar Ahora',

  'contact.whatsapp.title': '¿Prefieres WhatsApp?',
  'contact.whatsapp.desc': 'Chatea con nosotros al instante',
  'contact.whatsapp.button': 'Chat en WhatsApp',

  'contact.map.title': 'Digital Emporium HQ',
  'contact.map.address': '123 Tech Street, San Francisco, CA',
  'contact.map.button': 'Obtener Direcciones',

  // Quote
  quoteTitle: 'Solicita una Cotización',
  quoteSubtitle: 'Cuéntanos sobre tu proyecto y te enviaremos una propuesta personalizada.',
  fullName: 'Nombre Completo',
  company: 'Nombre de la Empresa (Opcional)',
  serviceInterested: 'Servicio de Interés',
  projectDetails: 'Detalles del Proyecto',
  submit: 'Enviar Solicitud',
  requestQuote: 'Solicitar Cotización',

  'quote.success.title': '¡Gracias!',
  'quote.success.message': 'Hemos recibido tu solicitud de cotización y te responderemos dentro de 24 horas.',
  'quote.success.button': 'Volver al Inicio',

  'quote.help.title': '¿Necesitas ayuda para elegir el servicio adecuado?',
  'quote.help.desc': 'Nuestro equipo está aquí para ayudarte a identificar la mejor solución para tus necesidades. Agenda una consulta gratuita para discutir tu proyecto.',
  'quote.help.button': 'Contáctanos',

  // Admin
  dashboard: 'Panel',
  manageServices: 'Gestionar Servicios',
  manageProjects: 'Gestionar Proyectos',
  manageTestimonials: 'Gestionar Testimonios',
  clientInquiries: 'Consultas de Clientes',
  siteSettings: 'Configuración del Sitio',
  statistics: 'Estadísticas',

  // Form
  required: 'Este campo es requerido',
  invalidEmail: 'Correo electrónico inválido',

  // Status
  status: 'Estado',
  pending: 'Pendiente',
  reviewed: 'Revisado',
  quoted: 'Cotizado',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

// ==================== ENGLISH ====================
const translationEN = {
  // Navigation
  home: 'Home',
  services: 'Services',
  projects: 'Projects',
  about: 'About Us',
  contact: 'Contact',
  quote: 'Request a Quote',
  admin: 'Admin',

  // Hero Section
  heroTitle1: 'We Transform Ideas Into',
  heroTitle2: 'Digital Solutions',
  heroSubtitle: 'We empower your business with cutting-edge technology, exceptional design, and innovative digital strategies.',
  getStarted: 'Get Started',
  learnMore: 'Learn More',

  // Home Page - Slides
  'slide1.title': 'Transform Your Digital Presence',
  'slide1.subtitle': 'Innovative solutions for modern businesses',
  'slide1.description': 'We create cutting-edge digital experiences that drive growth and engagement.',

  'slide2.title': 'AI-Powered Solutions',
  'slide2.subtitle': 'Intelligent automation for your business',
  'slide2.description': 'Leverage the power of artificial intelligence to streamline operations.',

  'slide3.title': 'E-Commerce Excellence',
  'slide3.subtitle': 'Build your online empire',
  'slide3.description': 'Complete e-commerce solutions that convert visitors into customers.',

  // Home - Features
  whyChooseTitle: 'Why Choose Digital Emporium?',
  whyChooseSubtitle: 'We combine innovation with expertise to deliver exceptional results',

  'feature.webDev.title': 'Web Development',
  'feature.webDev.desc': 'Custom websites built with modern technologies',

  'feature.ai.title': 'AI Solutions',
  'feature.ai.desc': 'Intelligent bots and automation systems',

  'feature.performance.title': 'Fast Performance',
  'feature.performance.desc': 'Optimized for speed and scalability',

  'feature.global.title': 'Global Reach',
  'feature.global.desc': 'Multi-language and international support',

  // Home - Stats
  'stat.projects': 'Projects Completed',
  'stat.clients': 'Happy Clients',
  'stat.experience': 'Years Experience',
  'stat.support': 'Support Available',

  // Home - CTA
  'cta.ready': 'Ready to start your project?',
  'cta.create': "Let's create something amazing together",

  // Services
  servicesTitle: 'Our Services',
  servicesSubtitle: 'We offer a comprehensive suite of digital services to elevate your business.',
  viewDetails: 'View Details',

  // Projects
  projectsTitle: 'Our Projects',
  projectsSubtitle: "Discover the innovative solutions and impactful projects we've delivered for our clients. Each project reflects our commitment to quality, creativity, and cutting-edge technology.",
  projectsDetails: 'View Project',

  // About
  aboutTitle: 'About Us',
  aboutSubtitle: 'Learn our story and what drives us.',
  welcomeTitle: 'Welcome to Digital Emporium!',
  welcomeText: 'We are a passionate team of developers, designers, and AI specialists dedicated to crafting innovative digital solutions that empower businesses and bring creative visions to life. Our expertise spans across web development, mobile app creation, bespoke AI agents, and strategic digital consulting. We believe in the transformative power of technology.',
  mission: 'Mission',
  vision: 'Vision',
  values: 'Values',
  missionText: 'To provide exceptional digital solutions that drive growth and success for our clients through innovative technology and outstanding service.',
  visionText: 'To be the leading digital solutions company, recognized for our excellence, innovation, and commitment to client success.',
  valuesText: 'Integrity, Innovation, Commitment, Excellence, Collaboration',

  // About - Values
  'values.title': 'Our Core Values',
  'values.subtitle': 'The principles that guide everything we do',

  'value.innovation': 'Innovation',
  'value.innovation.desc': 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.',

  'value.passion': 'Passion',
  'value.passion.desc': 'We love what we do, and that passion translates into exceptional work for our clients.',

  'value.excellence': 'Excellence',
  'value.excellence.desc': 'We maintain the highest standards in every project, ensuring quality and attention to detail.',

  'value.collaboration': 'Collaboration',
  'value.collaboration.desc': 'We work closely with our clients, believing that the best results come from teamwork.',

  // About - Team
  'team.title': 'Meet Our Team',
  'team.subtitle': 'The talented people behind Digital Emporium',

  // About - CTA
  'about.cta.title': "Let's work together",
  'about.cta.subtitle': 'Ready to bring your vision to life?',

  // Contact
  contactTitle: 'Contact Us',
  contactSubtitle: "Ready to start your project? We're here to help.",
  email: 'Email',
  phone: 'Phone',
  address: 'Address',

  'contact.info.email.title': 'Email',
  'contact.info.email.content': 'contact@digitalemporium.com',
  'contact.info.email.desc': 'Send us an email anytime',

  'contact.info.phone.title': 'Phone',
  'contact.info.phone.content': '+1 (555) 123-4567',
  'contact.info.phone.desc': 'Mon-Fri from 8am to 5pm',

  'contact.info.address.title': 'Address',
  'contact.info.address.content': '123 Tech Street, San Francisco, CA 94105',
  'contact.info.address.desc': 'Visit our office',

  'contact.hours.title': 'Working Hours',
  'contact.hours.weekday': 'Monday - Friday',
  'contact.hours.weekday.time': '8:00 AM - 6:00 PM',
  'contact.hours.saturday': 'Saturday',
  'contact.hours.saturday.time': '9:00 AM - 2:00 PM',
  'contact.hours.sunday': 'Sunday',
  'contact.hours.sunday.time': 'Closed',

  'contact.schedule.title': 'Schedule a Call',
  'contact.schedule.desc': 'Book a free consultation to discuss your project needs with our experts.',
  'contact.schedule.button': 'Book Now',

  'contact.whatsapp.title': 'Prefer WhatsApp?',
  'contact.whatsapp.desc': 'Chat with us instantly',
  'contact.whatsapp.button': 'Chat on WhatsApp',

  'contact.map.title': 'Digital Emporium HQ',
  'contact.map.address': '123 Tech Street, San Francisco, CA',
  'contact.map.button': 'Get Directions',

  // Quote
  quoteTitle: 'Request a Quote',
  quoteSubtitle: "Tell us about your project and we'll send you a personalized proposal.",
  fullName: 'Full Name',
  company: 'Company Name (Optional)',
  serviceInterested: 'Service of Interest',
  projectDetails: 'Project Details',
  submit: 'Submit Request',
  requestQuote: 'Request a Quote',

  'quote.success.title': 'Thank You!',
  'quote.success.message': "We've received your quote request and will get back to you within 24 hours.",
  'quote.success.button': 'Back to Home',

  'quote.help.title': 'Need help choosing the right service?',
  'quote.help.desc': 'Our team is here to help you identify the best solution for your needs. Schedule a free consultation to discuss your project.',
  'quote.help.button': 'Contact Us',

  // Admin
  dashboard: 'Dashboard',
  manageServices: 'Manage Services',
  manageProjects: 'Manage Projects',
  manageTestimonials: 'Manage Testimonials',
  clientInquiries: 'Client Inquiries',
  siteSettings: 'Site Settings',
  statistics: 'Statistics',

  // Form
  required: 'This field is required',
  invalidEmail: 'Invalid email address',

  // Status
  status: 'Status',
  pending: 'Pending',
  reviewed: 'Reviewed',
  quoted: 'Quoted',
  approved: 'Approved',
  rejected: 'Rejected',
};



// ─── Recursos ────────────────────────────────────────────────────────────────
const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
};



if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage'],
        caches: ['localStorage'],
      },
      // Evita pantalla en blanco: React renderiza con fallbackLng
      // mientras se detecta el idioma del usuario
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;