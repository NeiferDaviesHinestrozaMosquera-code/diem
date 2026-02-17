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

  // Services
  projectsTitle: 'Project mantenimiento',
  projectsSubtitle: 'Estamos trabajando para arreglar los errores de esta parte.',
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

// ==================== FRANÇAIS ====================
const translationFR = {
  // Navigation
  home: 'Accueil',
  services: 'Services',
  projects: 'Projets',
  about: 'À propos',
  contact: 'Contact',
  quote: 'Demander un devis',
  admin: 'Admin',
  
  // Hero Section
  heroTitle1: 'Nous transformons les idées en',
  heroTitle2: 'Solutions numériques',
  heroSubtitle: "Nous donnons à votre entreprise les moyens d'agir grâce à une technologie de pointe, un design exceptionnel et des stratégies numériques innovantes.",
  getStarted: 'Commencer',
  learnMore: 'En savoir plus',
  
  // Home Page - Slides
  'slide1.title': 'Transformez Votre Présence Numérique',
  'slide1.subtitle': 'Solutions innovantes pour les entreprises modernes',
  'slide1.description': 'Nous créons des expériences numériques de pointe qui stimulent la croissance et l\'engagement.',
  
  'slide2.title': 'Solutions Alimentées par l\'IA',
  'slide2.subtitle': 'Automatisation intelligente pour votre entreprise',
  'slide2.description': 'Exploitez la puissance de l\'intelligence artificielle pour rationaliser les opérations.',
  
  'slide3.title': 'Excellence E-Commerce',
  'slide3.subtitle': 'Construisez votre empire en ligne',
  'slide3.description': 'Solutions de commerce électronique complètes qui convertissent les visiteurs en clients.',
  
  // Home - Features
  whyChooseTitle: 'Pourquoi Choisir Digital Emporium?',
  whyChooseSubtitle: 'Nous combinons innovation et expertise pour offrir des résultats exceptionnels',
  
  'feature.webDev.title': 'Développement Web',
  'feature.webDev.desc': 'Sites web personnalisés construits avec des technologies modernes',
  
  'feature.ai.title': 'Solutions IA',
  'feature.ai.desc': 'Bots intelligents et systèmes d\'automatisation',
  
  'feature.performance.title': 'Performance Rapide',
  'feature.performance.desc': 'Optimisé pour la vitesse et l\'évolutivité',
  
  'feature.global.title': 'Portée Mondiale',
  'feature.global.desc': 'Support multilingue et international',
  
  // Home - Stats
  'stat.projects': 'Projets Complétés',
  'stat.clients': 'Clients Satisfaits',
  'stat.experience': 'Années d\'Expérience',
  'stat.support': 'Support Disponible',
  
  // Home - CTA
  'cta.ready': 'Prêt à démarrer votre projet?',
  'cta.create': 'Créons quelque chose d\'incroyable ensemble',
  
  // Services
  servicesTitle: 'Nos Services',
  servicesSubtitle: 'Nous proposons une suite complète de services numériques pour élever votre entreprise.',
  viewDetails: 'Voir les détails',
  
  // About
  aboutTitle: 'À Propos de Nous',
  aboutSubtitle: 'Découvrez notre histoire et ce qui nous anime.',
  welcomeTitle: 'Bienvenue chez Digital Emporium!',
  welcomeText: 'Nous sommes une équipe passionnée de développeurs, designers et spécialistes en IA dédiés à créer des solutions numériques innovantes qui donnent du pouvoir aux entreprises et donnent vie aux visions créatives.',
  mission: 'Mission',
  vision: 'Vision',
  values: 'Valeurs',
  missionText: 'Fournir des solutions numériques exceptionnelles qui stimulent la croissance et le succès de nos clients grâce à une technologie innovante et un service exceptionnel.',
  visionText: 'Être l\'entreprise leader en solutions numériques, reconnue pour notre excellence, notre innovation et notre engagement envers le succès de nos clients.',
  valuesText: 'Intégrité, Innovation, Engagement, Excellence, Collaboration',
  
  // About - Values
  'values.title': 'Nos Valeurs Fondamentales',
  'values.subtitle': 'Les principes qui guident tout ce que nous faisons',
  
  'value.innovation': 'Innovation',
  'value.innovation.desc': 'Nous repoussons constamment les limites et explorons de nouvelles technologies pour offrir des solutions de pointe.',
  
  'value.passion': 'Passion',
  'value.passion.desc': 'Nous aimons ce que nous faisons, et cette passion se traduit par un travail exceptionnel pour nos clients.',
  
  'value.excellence': 'Excellence',
  'value.excellence.desc': 'Nous maintenons les plus hauts standards dans chaque projet, assurant qualité et attention aux détails.',
  
  'value.collaboration': 'Collaboration',
  'value.collaboration.desc': 'Nous travaillons en étroite collaboration avec nos clients, croyant que les meilleurs résultats viennent du travail d\'équipe.',
  
  // About - Team
  'team.title': 'Rencontrez Notre Équipe',
  'team.subtitle': 'Les personnes talentueuses derrière Digital Emporium',
  
  // About - CTA
  'about.cta.title': 'Travaillons ensemble',
  'about.cta.subtitle': 'Prêt à donner vie à votre vision?',
  
  // Contact
  contactTitle: 'Contactez-nous',
  contactSubtitle: 'Prêt à démarrer votre projet? Nous sommes là pour vous aider.',
  email: 'Email',
  phone: 'Téléphone',
  address: 'Adresse',
  
  'contact.info.email.title': 'Email',
  'contact.info.email.content': 'contact@digitalemporium.com',
  'contact.info.email.desc': 'Envoyez-nous un email à tout moment',
  
  'contact.info.phone.title': 'Téléphone',
  'contact.info.phone.content': '+1 (555) 123-4567',
  'contact.info.phone.desc': 'Lun-Ven de 8h à 17h',
  
  'contact.info.address.title': 'Adresse',
  'contact.info.address.content': '123 Tech Street, San Francisco, CA 94105',
  'contact.info.address.desc': 'Visitez notre bureau',
  
  'contact.hours.title': 'Heures d\'Ouverture',
  'contact.hours.weekday': 'Lundi - Vendredi',
  'contact.hours.weekday.time': '8h00 - 18h00',
  'contact.hours.saturday': 'Samedi',
  'contact.hours.saturday.time': '9h00 - 14h00',
  'contact.hours.sunday': 'Dimanche',
  'contact.hours.sunday.time': 'Fermé',
  
  'contact.schedule.title': 'Planifier un Appel',
  'contact.schedule.desc': 'Réservez une consultation gratuite pour discuter des besoins de votre projet avec nos experts.',
  'contact.schedule.button': 'Réserver Maintenant',
  
  'contact.whatsapp.title': 'Vous préférez WhatsApp?',
  'contact.whatsapp.desc': 'Chattez avec nous instantanément',
  'contact.whatsapp.button': 'Chat sur WhatsApp',
  
  'contact.map.title': 'Digital Emporium QG',
  'contact.map.address': '123 Tech Street, San Francisco, CA',
  'contact.map.button': 'Obtenir l\'Itinéraire',
  
  // Quote
  quoteTitle: 'Demander un devis',
  quoteSubtitle: 'Parlez-nous de votre projet et nous vous enverrons une proposition personnalisée.',
  fullName: 'Nom complet',
  company: 'Nom de l\'entreprise (Optionnel)',
  serviceInterested: 'Service d\'intérêt',
  projectDetails: 'Détails du projet',
  submit: 'Soumettre la demande',
  requestQuote: 'Demander un devis',
  
  'quote.success.title': 'Merci!',
  'quote.success.message': 'Nous avons reçu votre demande de devis et vous répondrons dans les 24 heures.',
  'quote.success.button': 'Retour à l\'accueil',
  
  'quote.help.title': 'Besoin d\'aide pour choisir le bon service?',
  'quote.help.desc': 'Notre équipe est là pour vous aider à identifier la meilleure solution pour vos besoins. Planifiez une consultation gratuite pour discuter de votre projet.',
  'quote.help.button': 'Contactez-nous',
  
  // Admin
  dashboard: 'Tableau de bord',
  manageServices: 'Gérer les services',
  manageProjects: 'Gérer les projets',
  manageTestimonials: 'Gérer les témoignages',
  clientInquiries: 'Demandes des clients',
  siteSettings: 'Paramètres du site',
  statistics: 'Statistiques',
  
  // Form
  required: 'Ce champ est requis',
  invalidEmail: 'Adresse email invalide',
  
  // Status
  status: 'Statut',
  pending: 'En attente',
  reviewed: 'Examiné',
  quoted: 'Devisé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
};

// ==================== DEUTSCH ====================
const translationDE = {
  // Navigation
  home: 'Startseite',
  services: 'Dienstleistungen',
  projects: 'Projekte',
  about: 'Über uns',
  contact: 'Kontakt',
  quote: 'Angebot anfordern',
  admin: 'Admin',
  
  // Hero Section
  heroTitle1: 'Wir verwandeln Ideen in',
  heroTitle2: 'Digitale Lösungen',
  heroSubtitle: 'Wir stärken Ihr Unternehmen mit modernster Technologie, außergewöhnlichem Design und innovativen digitalen Strategien.',
  getStarted: 'Loslegen',
  learnMore: 'Mehr erfahren',
  
  // Home Page - Slides
  'slide1.title': 'Transformieren Sie Ihre Digitale Präsenz',
  'slide1.subtitle': 'Innovative Lösungen für moderne Unternehmen',
  'slide1.description': 'Wir schaffen modernste digitale Erlebnisse, die Wachstum und Engagement fördern.',
  
  'slide2.title': 'KI-Gesteuerte Lösungen',
  'slide2.subtitle': 'Intelligente Automatisierung für Ihr Unternehmen',
  'slide2.description': 'Nutzen Sie die Kraft der künstlichen Intelligenz zur Optimierung der Abläufe.',
  
  'slide3.title': 'E-Commerce-Exzellenz',
  'slide3.subtitle': 'Bauen Sie Ihr Online-Imperium auf',
  'slide3.description': 'Komplette E-Commerce-Lösungen, die Besucher in Kunden verwandeln.',
  
  // Home - Features
  whyChooseTitle: 'Warum Digital Emporium wählen?',
  whyChooseSubtitle: 'Wir kombinieren Innovation mit Expertise, um außergewöhnliche Ergebnisse zu liefern',
  
  'feature.webDev.title': 'Webentwicklung',
  'feature.webDev.desc': 'Maßgeschneiderte Websites mit modernen Technologien erstellt',
  
  'feature.ai.title': 'KI-Lösungen',
  'feature.ai.desc': 'Intelligente Bots und Automatisierungssysteme',
  
  'feature.performance.title': 'Schnelle Leistung',
  'feature.performance.desc': 'Optimiert für Geschwindigkeit und Skalierbarkeit',
  
  'feature.global.title': 'Globale Reichweite',
  'feature.global.desc': 'Mehrsprachige und internationale Unterstützung',
  
  // Home - Stats
  'stat.projects': 'Abgeschlossene Projekte',
  'stat.clients': 'Zufriedene Kunden',
  'stat.experience': 'Jahre Erfahrung',
  'stat.support': 'Support Verfügbar',
  
  // Home - CTA
  'cta.ready': 'Bereit, Ihr Projekt zu starten?',
  'cta.create': 'Lassen Sie uns gemeinsam etwas Erstaunliches schaffen',
  
  // Services
  servicesTitle: 'Unsere Dienstleistungen',
  servicesSubtitle: 'Wir bieten eine umfassende Suite digitaler Dienstleistungen, um Ihr Unternehmen zu verbessern.',
  viewDetails: 'Details anzeigen',
  
  // About
  aboutTitle: 'Über Uns',
  aboutSubtitle: 'Erfahren Sie unsere Geschichte und was uns antreibt.',
  welcomeTitle: 'Willkommen bei Digital Emporium!',
  welcomeText: 'Wir sind ein leidenschaftliches Team von Entwicklern, Designern und KI-Spezialisten, die sich der Schaffung innovativer digitaler Lösungen widmen.',
  mission: 'Mission',
  vision: 'Vision',
  values: 'Werte',
  missionText: 'Außergewöhnliche digitale Lösungen bereitzustellen, die Wachstum und Erfolg für unsere Kunden durch innovative Technologie und hervorragenden Service vorantreiben.',
  visionText: 'Das führende Unternehmen für digitale Lösungen zu sein, anerkannt für unsere Exzellenz, Innovation und Engagement für den Kundenerfolg.',
  valuesText: 'Integrität, Innovation, Engagement, Exzellenz, Zusammenarbeit',
  
  // About - Values
  'values.title': 'Unsere Grundwerte',
  'values.subtitle': 'Die Prinzipien, die alles leiten, was wir tun',
  
  'value.innovation': 'Innovation',
  'value.innovation.desc': 'Wir überschreiten ständig Grenzen und erkunden neue Technologien, um modernste Lösungen zu liefern.',
  
  'value.passion': 'Leidenschaft',
  'value.passion.desc': 'Wir lieben, was wir tun, und diese Leidenschaft führt zu außergewöhnlicher Arbeit für unsere Kunden.',
  
  'value.excellence': 'Exzellenz',
  'value.excellence.desc': 'Wir halten in jedem Projekt die höchsten Standards ein und gewährleisten Qualität und Liebe zum Detail.',
  
  'value.collaboration': 'Zusammenarbeit',
  'value.collaboration.desc': 'Wir arbeiten eng mit unseren Kunden zusammen und glauben, dass die besten Ergebnisse aus Teamarbeit entstehen.',
  
  // About - Team
  'team.title': 'Lernen Sie Unser Team Kennen',
  'team.subtitle': 'Die talentierten Menschen hinter Digital Emporium',
  
  // About - CTA
  'about.cta.title': 'Lassen Sie uns zusammenarbeiten',
  'about.cta.subtitle': 'Bereit, Ihre Vision zum Leben zu erwecken?',
  
  // Contact
  contactTitle: 'Kontaktieren Sie uns',
  contactSubtitle: 'Bereit, Ihr Projekt zu starten? Wir sind hier, um zu helfen.',
  email: 'E-Mail',
  phone: 'Telefon',
  address: 'Adresse',
  
  'contact.info.email.title': 'E-Mail',
  'contact.info.email.content': 'contact@digitalemporium.com',
  'contact.info.email.desc': 'Senden Sie uns jederzeit eine E-Mail',
  
  'contact.info.phone.title': 'Telefon',
  'contact.info.phone.content': '+1 (555) 123-4567',
  'contact.info.phone.desc': 'Mo-Fr von 8 bis 17 Uhr',
  
  'contact.info.address.title': 'Adresse',
  'contact.info.address.content': '123 Tech Street, San Francisco, CA 94105',
  'contact.info.address.desc': 'Besuchen Sie unser Büro',
  
  'contact.hours.title': 'Öffnungszeiten',
  'contact.hours.weekday': 'Montag - Freitag',
  'contact.hours.weekday.time': '8:00 - 18:00 Uhr',
  'contact.hours.saturday': 'Samstag',
  'contact.hours.saturday.time': '9:00 - 14:00 Uhr',
  'contact.hours.sunday': 'Sonntag',
  'contact.hours.sunday.time': 'Geschlossen',
  
  'contact.schedule.title': 'Einen Anruf Planen',
  'contact.schedule.desc': 'Buchen Sie eine kostenlose Beratung, um Ihre Projektanforderungen mit unseren Experten zu besprechen.',
  'contact.schedule.button': 'Jetzt Buchen',
  
  'contact.whatsapp.title': 'Bevorzugen Sie WhatsApp?',
  'contact.whatsapp.desc': 'Chatten Sie sofort mit uns',
  'contact.whatsapp.button': 'Chat auf WhatsApp',
  
  'contact.map.title': 'Digital Emporium Hauptsitz',
  'contact.map.address': '123 Tech Street, San Francisco, CA',
  'contact.map.button': 'Wegbeschreibung',
  
  // Quote
  quoteTitle: 'Angebot anfordern',
  quoteSubtitle: 'Erzählen Sie uns von Ihrem Projekt und wir senden Ihnen ein personalisiertes Angebot.',
  fullName: 'Vollständiger Name',
  company: 'Firmenname (Optional)',
  serviceInterested: 'Interessierter Service',
  projectDetails: 'Projektdetails',
  submit: 'Anfrage senden',
  requestQuote: 'Angebot anfordern',
  
  'quote.success.title': 'Vielen Dank!',
  'quote.success.message': 'Wir haben Ihre Angebotsanfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.',
  'quote.success.button': 'Zurück zur Startseite',
  
  'quote.help.title': 'Benötigen Sie Hilfe bei der Auswahl des richtigen Services?',
  'quote.help.desc': 'Unser Team hilft Ihnen gerne, die beste Lösung für Ihre Bedürfnisse zu finden. Vereinbaren Sie eine kostenlose Beratung, um Ihr Projekt zu besprechen.',
  'quote.help.button': 'Kontaktieren Sie uns',
  
  // Admin
  dashboard: 'Dashboard',
  manageServices: 'Dienste verwalten',
  manageProjects: 'Projekte verwalten',
  manageTestimonials: 'Testimonials verwalten',
  clientInquiries: 'Kundenanfragen',
  siteSettings: 'Site-Einstellungen',
  statistics: 'Statistiken',
  
  // Form
  required: 'Dieses Feld ist erforderlich',
  invalidEmail: 'Ungültige E-Mail-Adresse',
  
  // Status
  status: 'Status',
  pending: 'Ausstehend',
  reviewed: 'Überprüft',
  quoted: 'Angeboten',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
};

// ==================== PORTUGUÊS ====================
const translationPT = {
  // Navigation
  home: 'Início',
  services: 'Serviços',
  projects: 'Projetos',
  about: 'Sobre nós',
  contact: 'Contato',
  quote: 'Solicitar orçamento',
  admin: 'Admin',
  
  // Hero Section
  heroTitle1: 'Transformamos ideias em',
  heroTitle2: 'Soluções digitais',
  heroSubtitle: 'Capacitamos seu negócio com tecnologia de ponta, design excepcional e estratégias digitais inovadoras.',
  getStarted: 'Começar',
  learnMore: 'Saiba mais',
  
  // Home Page - Slides
  'slide1.title': 'Transforme Sua Presença Digital',
  'slide1.subtitle': 'Soluções inovadoras para empresas modernas',
  'slide1.description': 'Criamos experiências digitais de ponta que impulsionam o crescimento e o engajamento.',
  
  'slide2.title': 'Soluções Alimentadas por IA',
  'slide2.subtitle': 'Automatização inteligente para o seu negócio',
  'slide2.description': 'Aproveite o poder da inteligência artificial para otimizar as operações.',
  
  'slide3.title': 'Excelência em E-Commerce',
  'slide3.subtitle': 'Construa seu império online',
  'slide3.description': 'Soluções completas de comércio eletrônico que convertem visitantes em clientes.',
  
  // Home - Features
  whyChooseTitle: 'Por Que Escolher Digital Emporium?',
  whyChooseSubtitle: 'Combinamos inovação com experiência para oferecer resultados excepcionais',
  
  'feature.webDev.title': 'Desenvolvimento Web',
  'feature.webDev.desc': 'Sites personalizados construídos com tecnologias modernas',
  
  'feature.ai.title': 'Soluções IA',
  'feature.ai.desc': 'Bots inteligentes e sistemas de automatização',
  
  'feature.performance.title': 'Desempenho Rápido',
  'feature.performance.desc': 'Otimizado para velocidade e escalabilidade',
  
  'feature.global.title': 'Alcance Global',
  'feature.global.desc': 'Suporte multilingue e internacional',
  
  // Home - Stats
  'stat.projects': 'Projetos Concluídos',
  'stat.clients': 'Clientes Satisfeitos',
  'stat.experience': 'Anos de Experiência',
  'stat.support': 'Suporte Disponível',
  
  // Home - CTA
  'cta.ready': 'Pronto para iniciar seu projeto?',
  'cta.create': 'Vamos criar algo incrível juntos',
  
  // Services
  servicesTitle: 'Nossos Serviços',
  servicesSubtitle: 'Oferecemos um conjunto abrangente de serviços digitais para elevar seu negócio.',
  viewDetails: 'Ver detalhes',
  
  // About
  aboutTitle: 'Sobre Nós',
  aboutSubtitle: 'Conheça nossa história e o que nos motiva.',
  welcomeTitle: 'Bem-vindo ao Digital Emporium!',
  welcomeText: 'Somos uma equipe apaixonada de desenvolvedores, designers e especialistas em IA dedicados a criar soluções digitais inovadoras.',
  mission: 'Missão',
  vision: 'Visão',
  values: 'Valores',
  missionText: 'Fornecer soluções digitais excepcionais que impulsionam o crescimento e sucesso de nossos clientes através de tecnologia inovadora e serviço excepcional.',
  visionText: 'Ser a empresa líder em soluções digitais, reconhecida por nossa excelência, inovação e compromisso com o sucesso do cliente.',
  valuesText: 'Integridade, Inovação, Compromisso, Excelência, Colaboração',
  
  // About - Values
  'values.title': 'Nossos Valores Fundamentais',
  'values.subtitle': 'Os princípios que guiam tudo o que fazemos',
  
  'value.innovation': 'Inovação',
  'value.innovation.desc': 'Constantemente ultrapassamos limites e exploramos novas tecnologias para oferecer soluções de ponta.',
  
  'value.passion': 'Paixão',
  'value.passion.desc': 'Amamos o que fazemos, e essa paixão se traduz em trabalho excepcional para nossos clientes.',
  
  'value.excellence': 'Excelência',
  'value.excellence.desc': 'Mantemos os mais altos padrões em cada projeto, garantindo qualidade e atenção aos detalhes.',
  
  'value.collaboration': 'Colaboração',
  'value.collaboration.desc': 'Trabalhamos em estreita colaboração com nossos clientes, acreditando que os melhores resultados vêm do trabalho em equipe.',
  
  // About - Team
  'team.title': 'Conheça Nossa Equipe',
  'team.subtitle': 'As pessoas talentosas por trás do Digital Emporium',
  
  // About - CTA
  'about.cta.title': 'Vamos trabalhar juntos',
  'about.cta.subtitle': 'Pronto para dar vida à sua visão?',
  
  // Contact
  contactTitle: 'Entre em Contato',
  contactSubtitle: 'Pronto para iniciar seu projeto? Estamos aqui para ajudar.',
  email: 'E-mail',
  phone: 'Telefone',
  address: 'Endereço',
  
  'contact.info.email.title': 'E-mail',
  'contact.info.email.content': 'contact@digitalemporium.com',
  'contact.info.email.desc': 'Envie-nos um e-mail a qualquer momento',
  
  'contact.info.phone.title': 'Telefone',
  'contact.info.phone.content': '+1 (555) 123-4567',
  'contact.info.phone.desc': 'Seg-Sex das 8h às 17h',
  
  'contact.info.address.title': 'Endereço',
  'contact.info.address.content': '123 Tech Street, San Francisco, CA 94105',
  'contact.info.address.desc': 'Visite nosso escritório',
  
  'contact.hours.title': 'Horário de Funcionamento',
  'contact.hours.weekday': 'Segunda - Sexta',
  'contact.hours.weekday.time': '8:00 - 18:00',
  'contact.hours.saturday': 'Sábado',
  'contact.hours.saturday.time': '9:00 - 14:00',
  'contact.hours.sunday': 'Domingo',
  'contact.hours.sunday.time': 'Fechado',
  
  'contact.schedule.title': 'Agendar uma Chamada',
  'contact.schedule.desc': 'Marque uma consulta gratuita para discutir as necessidades do seu projeto com nossos especialistas.',
  'contact.schedule.button': 'Agendar Agora',
  
  'contact.whatsapp.title': 'Prefere WhatsApp?',
  'contact.whatsapp.desc': 'Converse conosco instantaneamente',
  'contact.whatsapp.button': 'Chat no WhatsApp',
  
  'contact.map.title': 'Digital Emporium Sede',
  'contact.map.address': '123 Tech Street, San Francisco, CA',
  'contact.map.button': 'Obter Direções',
  
  // Quote
  quoteTitle: 'Solicitar orçamento',
  quoteSubtitle: 'Conte-nos sobre seu projeto e enviaremos uma proposta personalizada.',
  fullName: 'Nome completo',
  company: 'Nome da empresa (Opcional)',
  serviceInterested: 'Serviço de interesse',
  projectDetails: 'Detalhes do projeto',
  submit: 'Enviar solicitação',
  requestQuote: 'Solicitar orçamento',
  
  'quote.success.title': 'Obrigado!',
  'quote.success.message': 'Recebemos sua solicitação de orçamento e entraremos em contato dentro de 24 horas.',
  'quote.success.button': 'Voltar ao Início',
  
  'quote.help.title': 'Precisa de ajuda para escolher o serviço certo?',
  'quote.help.desc': 'Nossa equipe está aqui para ajudá-lo a identificar a melhor solução para suas necessidades. Agende uma consulta gratuita para discutir seu projeto.',
  'quote.help.button': 'Entre em Contato',
  
  // Admin
  dashboard: 'Painel',
  manageServices: 'Gerenciar serviços',
  manageProjects: 'Gerenciar projetos',
  manageTestimonials: 'Gerenciar depoimentos',
  clientInquiries: 'Consultas de clientes',
  siteSettings: 'Configurações do site',
  statistics: 'Estatísticas',
  
  // Form
  required: 'Este campo é obrigatório',
  invalidEmail: 'Endereço de e-mail inválido',
  
  // Status
  status: 'Status',
  pending: 'Pendente',
  reviewed: 'Revisado',
  quoted: 'Orçado',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

// Recursos de traducción
const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
  fr: { translation: translationFR },
  de: { translation: translationDE },
  pt: { translation: translationPT }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
