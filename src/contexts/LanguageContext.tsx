// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// // Traducciones en Español
// const translationES = {
//   // Navigation
//   home: 'Inicio',
//   services: 'Servicios',
//   projects: 'Proyectos',
//   about: 'Nosotros',
//   contact: 'Contacto',
//   quote: 'Cotizar',
//   admin: 'Admin',
  
//   // Hero
//   heroTitle1: 'Transformamos Ideas en',
//   heroTitle2: 'Soluciones Digitales',
//   heroSubtitle: 'Potenciamos tu negocio con tecnología de vanguardia, diseño excepcional y estrategias digitales innovadoras.',
//   getStarted: 'Comenzar',
//   learnMore: 'Saber Más',
  
//   // Services
//   servicesTitle: 'Nuestros Servicios',
//   servicesSubtitle: 'Ofrecemos una suite completa de servicios digitales para elevar tu negocio.',
//   viewDetails: 'Ver Detalles',
  
//   // Projects
//   projectsTitle: 'Nuestros Proyectos',
//   projectsSubtitle: 'Descubre las soluciones innovadoras e impactantes que hemos entregado a nuestros clientes. Cada proyecto refleja nuestro compromiso con la calidad, creatividad y tecnología de vanguardia.',
//   client: 'Cliente',
//   category: 'Categoría',
//   technologies: 'Tecnologías',
//   projectDate: 'Fecha',
//   visitProject: 'Visitar Proyecto',
  
//   // About
//   aboutTitle: 'Sobre Nosotros',
//   aboutSubtitle: 'Conoce nuestra historia y lo que nos impulsa.',
//   welcomeTitle: '¡Bienvenido a Digital Emporium!',
//   welcomeText: 'Somos un equipo apasionado de desarrolladores, diseñadores y especialistas en IA dedicados a crear soluciones digitales innovadoras que potencian los negocios y dan vida a las visiones creativas. Nuestra experiencia abarca el desarrollo web, la creación de aplicaciones móviles, agentes de IA personalizados y consultoría digital estratégica. Creemos en el poder transformador de la tecnología.',
//   mission: 'Misión',
//   vision: 'Visión',
//   values: 'Valores',
//   missionText: 'Proporcionar soluciones digitales excepcionales que impulsen el crecimiento y éxito de nuestros clientes mediante tecnología innovadora y un servicio excepcional.',
//   visionText: 'Ser la empresa líder en soluciones digitales, reconocida por nuestra excelencia, innovación y compromiso con el éxito de nuestros clientes.',
//   valuesText: 'Integridad, Innovación, Compromiso, Excelencia, Colaboración',
  
//   // Contact
//   contactTitle: 'Contáctanos',
//   contactSubtitle: '¿Listo para iniciar tu proyecto? Estamos aquí para ayudarte.',
//   email: 'Correo Electrónico',
//   phone: 'Teléfono',
//   address: 'Dirección',
//   requestQuote: 'Solicitar Cotización',
  
//   // Quote
//   quoteTitle: 'Solicita una Cotización',
//   quoteSubtitle: 'Cuéntanos sobre tu proyecto y te enviaremos una propuesta personalizada.',
//   fullName: 'Nombre Completo',
//   company: 'Nombre de la Empresa (Opcional)',
//   serviceInterested: 'Servicio de Interés',
//   projectDetails: 'Detalles del Proyecto',
//   submit: 'Enviar Solicitud',
  
//   // Admin
//   dashboard: 'Panel',
//   manageServices: 'Gestionar Servicios',
//   manageProjects: 'Gestionar Proyectos',
//   manageTestimonials: 'Gestionar Testimonios',
//   clientInquiries: 'Consultas de Clientes',
//   siteSettings: 'Configuración del Sitio',
//   statistics: 'Estadísticas',
  
//   // Form validations
//   required: 'Este campo es requerido',
//   invalidEmail: 'Correo electrónico inválido',
  
//   // Status
//   status: 'Estado',
//   pending: 'Pendiente',
//   reviewed: 'Revisado',
//   quoted: 'Cotizado',
//   approved: 'Aprobado',
//   rejected: 'Rechazado',
// };

// // Traducciones en Inglés
// const translationEN = {
//   // Navigation
//   home: 'Home',
//   services: 'Services',
//   projects: 'Projects',
//   about: 'About Us',
//   contact: 'Contact',
//   quote: 'Request a Quote',
//   admin: 'Admin',
  
//   // Hero
//   heroTitle1: 'We Transform Ideas Into',
//   heroTitle2: 'Digital Solutions',
//   heroSubtitle: 'We empower your business with cutting-edge technology, exceptional design, and innovative digital strategies.',
//   getStarted: 'Get Started',
//   learnMore: 'Learn More',
  
//   // Services
//   servicesTitle: 'Our Services',
//   servicesSubtitle: 'We offer a comprehensive suite of digital services to elevate your business.',
//   viewDetails: 'View Details',
  
//   // Projects
//   projectsTitle: 'Our Projects',
//   projectsSubtitle: 'Discover the innovative solutions and impactful projects we\'ve delivered for our clients. Each project reflects our commitment to quality, creativity, and cutting-edge technology.',
//   client: 'Client',
//   category: 'Category',
//   technologies: 'Technologies',
//   projectDate: 'Date',
//   visitProject: 'Visit Project',
  
//   // About
//   aboutTitle: 'About Us',
//   aboutSubtitle: 'Learn our story and what drives us.',
//   welcomeTitle: 'Welcome to Digital Emporium!',
//   welcomeText: 'We are a passionate team of developers, designers, and AI specialists dedicated to crafting innovative digital solutions that empower businesses and bring creative visions to life. Our expertise spans across web development, mobile app creation, bespoke AI agents, and strategic digital consulting. We believe in the transformative power of technology.',
//   mission: 'Mission',
//   vision: 'Vision',
//   values: 'Values',
//   missionText: 'To provide exceptional digital solutions that drive growth and success for our clients through innovative technology and outstanding service.',
//   visionText: 'To be the leading digital solutions company, recognized for our excellence, innovation, and commitment to client success.',
//   valuesText: 'Integrity, Innovation, Commitment, Excellence, Collaboration',
  
//   // Contact
//   contactTitle: 'Contact Us',
//   contactSubtitle: 'Ready to start your project? We\'re here to help.',
//   email: 'Email',
//   phone: 'Phone',
//   address: 'Address',
//   requestQuote: 'Request a Quote',
  
//   // Quote
//   quoteTitle: 'Request a Quote',
//   quoteSubtitle: 'Tell us about your project and we\'ll send you a personalized proposal.',
//   fullName: 'Full Name',
//   company: 'Company Name (Optional)',
//   serviceInterested: 'Service of Interest',
//   projectDetails: 'Project Details',
//   submit: 'Submit Request',
  
//   // Admin
//   dashboard: 'Dashboard',
//   manageServices: 'Manage Services',
//   manageProjects: 'Manage Projects',
//   manageTestimonials: 'Manage Testimonials',
//   clientInquiries: 'Client Inquiries',
//   siteSettings: 'Site Settings',
//   statistics: 'Statistics',
  
//   // Form validations
//   required: 'This field is required',
//   invalidEmail: 'Invalid email address',
  
//   // Status
//   status: 'Status',
//   pending: 'Pending',
//   reviewed: 'Reviewed',
//   quoted: 'Quoted',
//   approved: 'Approved',
//   rejected: 'Rejected',
// };

// // Traducciones en Francés
// const translationFR = {
//   // Navigation
//   home: 'Accueil',
//   services: 'Services',
//   projects: 'Projets',
//   about: 'À propos',
//   contact: 'Contact',
//   quote: 'Demander un devis',
//   admin: 'Admin',
  
//   // Hero
//   heroTitle1: 'Nous transformons les idées en',
//   heroTitle2: 'Solutions numériques',
//   heroSubtitle: 'Nous donnons à votre entreprise les moyens d\'agir grâce à une technologie de pointe, un design exceptionnel et des stratégies numériques innovantes.',
//   getStarted: 'Commencer',
//   learnMore: 'En savoir plus',
  
//   // Services
//   servicesTitle: 'Nos Services',
//   servicesSubtitle: 'Nous proposons une suite complète de services numériques pour élever votre entreprise.',
//   viewDetails: 'Voir les détails',
  
//   // Projects
//   projectsTitle: 'Nos Projets',
//   projectsSubtitle: 'Découvrez les solutions innovantes et les projets percutants que nous avons livrés pour nos clients. Chaque projet reflète notre engagement envers la qualité, la créativité et la technologie de pointe.',
//   client: 'Client',
//   category: 'Catégorie',
//   technologies: 'Technologies',
//   projectDate: 'Date',
//   visitProject: 'Visiter le projet',
  
//   // About
//   aboutTitle: 'À Propos de Nous',
//   aboutSubtitle: 'Découvrez notre histoire et ce qui nous anime.',
//   welcomeTitle: 'Bienvenue chez Digital Emporium!',
//   welcomeText: 'Nous sommes une équipe passionnée de développeurs, designers et spécialistes en IA dédiés à créer des solutions numériques innovantes qui donnent du pouvoir aux entreprises et donnent vie aux visions créatives. Notre expertise couvre le développement web, la création d\'applications mobiles, les agents IA sur mesure et le conseil stratégique numérique. Nous croyons au pouvoir transformateur de la technologie.',
//   mission: 'Mission',
//   vision: 'Vision',
//   values: 'Valeurs',
//   missionText: 'Fournir des solutions numériques exceptionnelles qui stimulent la croissance et le succès de nos clients grâce à une technologie innovante et un service exceptionnel.',
//   visionText: 'Être l\'entreprise leader en solutions numériques, reconnue pour notre excellence, notre innovation et notre engagement envers le succès de nos clients.',
//   valuesText: 'Intégrité, Innovation, Engagement, Excellence, Collaboration',
  
//   // Contact
//   contactTitle: 'Contactez-nous',
//   contactSubtitle: 'Prêt à démarrer votre projet? Nous sommes là pour vous aider.',
//   email: 'Email',
//   phone: 'Téléphone',
//   address: 'Adresse',
//   requestQuote: 'Demander un devis',
  
//   // Quote
//   quoteTitle: 'Demander un devis',
//   quoteSubtitle: 'Parlez-nous de votre projet et nous vous enverrons une proposition personnalisée.',
//   fullName: 'Nom complet',
//   company: 'Nom de l\'entreprise (Optionnel)',
//   serviceInterested: 'Service d\'intérêt',
//   projectDetails: 'Détails du projet',
//   submit: 'Soumettre la demande',
  
//   // Admin
//   dashboard: 'Tableau de bord',
//   manageServices: 'Gérer les services',
//   manageProjects: 'Gérer les projets',
//   manageTestimonials: 'Gérer les témoignages',
//   clientInquiries: 'Demandes des clients',
//   siteSettings: 'Paramètres du site',
//   statistics: 'Statistiques',
  
//   // Form validations
//   required: 'Ce champ est requis',
//   invalidEmail: 'Adresse email invalide',
  
//   // Status
//   status: 'Statut',
//   pending: 'En attente',
//   reviewed: 'Examiné',
//   quoted: 'Devisé',
//   approved: 'Approuvé',
//   rejected: 'Rejeté',
// };

// // Traducciones en Alemán
// const translationDE = {
//   // Navigation
//   home: 'Startseite',
//   services: 'Dienstleistungen',
//   projects: 'Projekte',
//   about: 'Über uns',
//   contact: 'Kontakt',
//   quote: 'Angebot anfordern',
//   admin: 'Admin',
  
//   // Hero
//   heroTitle1: 'Wir verwandeln Ideen in',
//   heroTitle2: 'Digitale Lösungen',
//   heroSubtitle: 'Wir stärken Ihr Unternehmen mit modernster Technologie, außergewöhnlichem Design und innovativen digitalen Strategien.',
//   getStarted: 'Loslegen',
//   learnMore: 'Mehr erfahren',
  
//   // Services
//   servicesTitle: 'Unsere Dienstleistungen',
//   servicesSubtitle: 'Wir bieten eine umfassende Suite digitaler Dienstleistungen, um Ihr Unternehmen zu verbessern.',
//   viewDetails: 'Details anzeigen',
  
//   // Projects
//   projectsTitle: 'Unsere Projekte',
//   projectsSubtitle: 'Entdecken Sie die innovativen Lösungen und wirkungsvollen Projekte, die wir für unsere Kunden geliefert haben. Jedes Projekt spiegelt unser Engagement für Qualität, Kreativität und modernste Technologie wider.',
//   client: 'Kunde',
//   category: 'Kategorie',
//   technologies: 'Technologien',
//   projectDate: 'Datum',
//   visitProject: 'Projekt besuchen',
  
//   // About
//   aboutTitle: 'Über Uns',
//   aboutSubtitle: 'Erfahren Sie unsere Geschichte und was uns antreibt.',
//   welcomeTitle: 'Willkommen bei Digital Emporium!',
//   welcomeText: 'Wir sind ein leidenschaftliches Team von Entwicklern, Designern und KI-Spezialisten, die sich der Schaffung innovativer digitaler Lösungen widmen, die Unternehmen stärken und kreative Visionen zum Leben erwecken. Unsere Expertise erstreckt sich über Webentwicklung, mobile App-Erstellung, maßgeschneiderte KI-Agenten und strategische digitale Beratung. Wir glauben an die transformative Kraft der Technologie.',
//   mission: 'Mission',
//   vision: 'Vision',
//   values: 'Werte',
//   missionText: 'Außergewöhnliche digitale Lösungen bereitzustellen, die Wachstum und Erfolg für unsere Kunden durch innovative Technologie und hervorragenden Service vorantreiben.',
//   visionText: 'Das führende Unternehmen für digitale Lösungen zu sein, anerkannt für unsere Exzellenz, Innovation und Engagement für den Kundenerfolg.',
//   valuesText: 'Integrität, Innovation, Engagement, Exzellenz, Zusammenarbeit',
  
//   // Contact
//   contactTitle: 'Kontaktieren Sie uns',
//   contactSubtitle: 'Bereit, Ihr Projekt zu starten? Wir sind hier, um zu helfen.',
//   email: 'E-Mail',
//   phone: 'Telefon',
//   address: 'Adresse',
//   requestQuote: 'Angebot anfordern',
  
//   // Quote
//   quoteTitle: 'Angebot anfordern',
//   quoteSubtitle: 'Erzählen Sie uns von Ihrem Projekt und wir senden Ihnen ein personalisiertes Angebot.',
//   fullName: 'Vollständiger Name',
//   company: 'Firmenname (Optional)',
//   serviceInterested: 'Interessierter Service',
//   projectDetails: 'Projektdetails',
//   submit: 'Anfrage senden',
  
//   // Admin
//   dashboard: 'Dashboard',
//   manageServices: 'Dienste verwalten',
//   manageProjects: 'Projekte verwalten',
//   manageTestimonials: 'Testimonials verwalten',
//   clientInquiries: 'Kundenanfragen',
//   siteSettings: 'Site-Einstellungen',
//   statistics: 'Statistiken',
  
//   // Form validations
//   required: 'Dieses Feld ist erforderlich',
//   invalidEmail: 'Ungültige E-Mail-Adresse',
  
//   // Status
//   status: 'Status',
//   pending: 'Ausstehend',
//   reviewed: 'Überprüft',
//   quoted: 'Angeboten',
//   approved: 'Genehmigt',
//   rejected: 'Abgelehnt',
// };

// // Traducciones en Portugués
// const translationPT = {
//   // Navigation
//   home: 'Início',
//   services: 'Serviços',
//   projects: 'Projetos',
//   about: 'Sobre nós',
//   contact: 'Contato',
//   quote: 'Solicitar orçamento',
//   admin: 'Admin',
  
//   // Hero
//   heroTitle1: 'Transformamos ideias em',
//   heroTitle2: 'Soluções digitais',
//   heroSubtitle: 'Capacitamos seu negócio com tecnologia de ponta, design excepcional e estratégias digitais inovadoras.',
//   getStarted: 'Começar',
//   learnMore: 'Saiba mais',
  
//   // Services
//   servicesTitle: 'Nossos Serviços',
//   servicesSubtitle: 'Oferecemos um conjunto abrangente de serviços digitais para elevar seu negócio.',
//   viewDetails: 'Ver detalhes',
  
//   // Projects
//   projectsTitle: 'Nossos Projetos',
//   projectsSubtitle: 'Descubra as soluções inovadoras e projetos impactantes que entregamos para nossos clientes. Cada projeto reflete nosso compromisso com qualidade, criatividade e tecnologia de ponta.',
//   client: 'Cliente',
//   category: 'Categoria',
//   technologies: 'Tecnologias',
//   projectDate: 'Data',
//   visitProject: 'Visitar projeto',
  
//   // About
//   aboutTitle: 'Sobre Nós',
//   aboutSubtitle: 'Conheça nossa história e o que nos motiva.',
//   welcomeTitle: 'Bem-vindo ao Digital Emporium!',
//   welcomeText: 'Somos uma equipe apaixonada de desenvolvedores, designers e especialistas em IA dedicados a criar soluções digitais inovadoras que capacitam empresas e dão vida a visões criativas. Nossa expertise abrange desenvolvimento web, criação de aplicativos móveis, agentes de IA personalizados e consultoria digital estratégica. Acreditamos no poder transformador da tecnologia.',
//   mission: 'Missão',
//   vision: 'Visão',
//   values: 'Valores',
//   missionText: 'Fornecer soluções digitais excepcionais que impulsionam o crescimento e sucesso de nossos clientes através de tecnologia inovadora e serviço excepcional.',
//   visionText: 'Ser a empresa líder em soluções digitais, reconhecida por nossa excelência, inovação e compromisso com o sucesso do cliente.',
//   valuesText: 'Integridade, Inovação, Compromisso, Excelência, Colaboração',
  
//   // Contact
//   contactTitle: 'Entre em Contato',
//   contactSubtitle: 'Pronto para iniciar seu projeto? Estamos aqui para ajudar.',
//   email: 'E-mail',
//   phone: 'Telefone',
//   address: 'Endereço',
//   requestQuote: 'Solicitar orçamento',
  
//   // Quote
//   quoteTitle: 'Solicitar orçamento',
//   quoteSubtitle: 'Conte-nos sobre seu projeto e enviaremos uma proposta personalizada.',
//   fullName: 'Nome completo',
//   company: 'Nome da empresa (Opcional)',
//   serviceInterested: 'Serviço de interesse',
//   projectDetails: 'Detalhes do projeto',
//   submit: 'Enviar solicitação',
  
//   // Admin
//   dashboard: 'Painel',
//   manageServices: 'Gerenciar serviços',
//   manageProjects: 'Gerenciar projetos',
//   manageTestimonials: 'Gerenciar depoimentos',
//   clientInquiries: 'Consultas de clientes',
//   siteSettings: 'Configurações do site',
//   statistics: 'Estatísticas',
  
//   // Form validations
//   required: 'Este campo é obrigatório',
//   invalidEmail: 'Endereço de e-mail inválido',
  
//   // Status
//   status: 'Status',
//   pending: 'Pendente',
//   reviewed: 'Revisado',
//   quoted: 'Orçado',
//   approved: 'Aprovado',
//   rejected: 'Rejeitado',
// };

// // Recursos de traducción
// const resources = {
//   es: { translation: translationES },
//   en: { translation: translationEN },
//   fr: { translation: translationFR },
//   de: { translation: translationDE },
//   pt: { translation: translationPT }
// };

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     fallbackLng: 'en',
//     debug: false,
//     interpolation: {
//       escapeValue: false
//     },
//     detection: {
//       order: ['localStorage', 'navigator', 'htmlTag'],
//       caches: ['localStorage'],
//     }
//   });

// export default i18n;
