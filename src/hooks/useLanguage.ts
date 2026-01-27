import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: any;
}

const translations: Translations = {
  es: {
    // Navigation
    nav: {
      services: 'Servicios',
      portfolio: 'Portafolio',
      about: 'Acerca de',
      blog: 'Blog',
      getQuote: 'Obtener Cotización'
    },
    // Home
    home: {
      title: "Construyamos Algo",
      titleHighlight: "Increíble",
      titleEnd: "Juntos",
      subtitle: "¿Tienes una visión? Tenemos la experiencia digital para hacerla realidad. Contáctanos hoy y comencemos tu viaje.",
      emailUs: "Envíanos un correo",
      callUs: "Llámanos",
      visitUs: "Visítanos",
      copyEmail: "Copiar Email",
      callNow: "Llamar Ahora",
      openMaps: "Abrir en Maps",
      readyTitle: "¿Listo para comenzar tu proyecto?",
      readySubtitle: "Obtén una cotización gratuita hoy y definamos tu futuro digital.",
      requestQuote: "Solicitar Cotización"
    },
    // Services
    services: {
      sectionTitle: "Nuestros Servicios",
      title: "Servicios",
      subtitle: "Soluciones digitales completas para tu negocio"
    },
    // Projects
    projects: {
      sectionTitle: "Nuestro Trabajo",
      title: "Proyectos",
      subtitle: "Explora nuestro portafolio de proyectos exitosos"
    },
    // About
    about: {
      sectionTitle: "Quiénes Somos",
      title: "Acerca de",
      subtitle: "Conoce más sobre nuestro equipo y visión"
    },
    // Contact
    contact: {
      sectionTitle: "Contáctanos",
      title: "Contacto",
      subtitle: "Estamos aquí para ayudarte"
    },
    // Request Quote
    quote: {
      sectionTitle: "Solicita tu Cotización",
      title: "Cotización",
      subtitle: "Cuéntanos sobre tu proyecto"
    },
    // Footer
    footer: {
      rights: "Todos los derechos reservados."
    }
  },
  en: {
    // Navigation
    nav: {
      services: 'Services',
      portfolio: 'Portfolio',
      about: 'About',
      blog: 'Blog',
      getQuote: 'Get a Quote'
    },
    // Home
    home: {
      title: "Let's Build Something",
      titleHighlight: "Amazing",
      titleEnd: "Together",
      subtitle: "Have a vision? We have the digital expertise to bring it to life. Reach out today and let's start your journey.",
      emailUs: "Email Us",
      callUs: "Call Us",
      visitUs: "Visit Us",
      copyEmail: "Copy Email",
      callNow: "Call Now",
      openMaps: "Open in Maps",
      readyTitle: "Ready to start your project?",
      readySubtitle: "Get a Free Quote Today and let's define your digital future.",
      requestQuote: "Request a Quote"
    },
    // Services
    services: {
      sectionTitle: "Our Services",
      title: "Services",
      subtitle: "Complete digital solutions for your business"
    },
    // Projects
    projects: {
      sectionTitle: "Our Work",
      title: "Projects",
      subtitle: "Explore our portfolio of successful projects"
    },
    // About
    about: {
      sectionTitle: "Who We Are",
      title: "About",
      subtitle: "Learn more about our team and vision"
    },
    // Contact
    contact: {
      sectionTitle: "Get In Touch",
      title: "Contact",
      subtitle: "We're here to help you"
    },
    // Request Quote
    quote: {
      sectionTitle: "Request Your Quote",
      title: "Quote",
      subtitle: "Tell us about your project"
    },
    // Footer
    footer: {
      rights: "All rights reserved."
    }
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<string>(() => {
    // Cargar idioma guardado o usar navegador
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) return savedLang;
    
    const browserLang = navigator.language.split('-')[0];
    return ['es', 'en'].includes(browserLang) ? browserLang : 'en';
  });

  useEffect(() => {
    // Guardar idioma seleccionado
    localStorage.setItem('preferred-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLang: string) => {
    if (translations[newLang]) {
      setLanguage(newLang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { language, changeLanguage, t };
};

export default useLanguage;
