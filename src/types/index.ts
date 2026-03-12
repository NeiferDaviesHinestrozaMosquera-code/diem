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

// ═══════════════════════════════════════════════════════════════
// TEAM MEMBER
// ═══════════════════════════════════════════════════════════════

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// QUOTE REQUEST - 5 ESTADOS
// ═══════════════════════════════════════════════════════════════

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone: string;
  service: string;
  projectDetails: string;
  status: 'pending' | 'processed' | 'error';
  createdAt: Date;
  updatedAt: Date;
  aiReport?: AIReport;
  pdfUrl?: string;
}

export const QuoteStatus = {
  PENDING:   'pending',
  PROCESSED: 'processed',
  ERROR:     'error',
} as const;
export type QuoteStatus = typeof QuoteStatus[keyof typeof QuoteStatus];

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
  recommendations?: string[]
  milestones?: string[];
  generatedAt?: string;
  language?: 'es' | 'en';
}

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// PRIVACY POLICY
// ═══════════════════════════════════════════════════════════════

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

// ─── Types ────────────────────────────────────────────────────────────────────

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
  created_at:  string;
  updated_at:  string;
}

export interface TermsMeta {
  id:            string;
  page_title:    string;
  page_subtitle: string;
  last_updated:  string;
  contact_email: string;
  updated_at:    string;
}

export type NewTermsSection = Omit<TermsSection, 'id' | 'created_at' | 'updated_at'>;

export type Theme = 'light' | 'dark' | 'system';