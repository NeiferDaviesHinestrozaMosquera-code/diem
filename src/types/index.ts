export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  price: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  client: string;
  category: string;
  technologies: Technology[];
  images: string[];
  projectUrl?: string;
  completionDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technology {
  name: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: Date;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone: string;
  service: string;
  projectDetails: string;
   status: 'pending' | 'processing' | 'completed' | 'error' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  aiReport?: AIReport;
  pdfUrl?: string;
}

export interface AIReport {
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
  recommendations?: string[];
  milestones?: string[];
  generatedAt?: string;
  language: 'es' | 'en';
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  servicesText: string;
  projectsText: string;
  contactText: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    instagram?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  carouselImages: string[];
  heroImages: string[];
  servicesImages: string[];
  testimonialsBackground: string;
  footerText: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  customScripts: string;
}

export type Theme = 'light' | 'dark' | 'system';