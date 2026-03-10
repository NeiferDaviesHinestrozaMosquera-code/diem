import { motion } from 'framer-motion';
import {
  ShoppingBag, Mail, Phone, MapPin,
  Github, Linkedin, Twitter, Facebook, Instagram,
  Youtube, MessageCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useSiteSettings } from '@/hooks/use-siteSettings';

// Valores por defecto cuando la BD no tiene datos
const DEFAULTS = {
  siteName:   'Digital Emporium',
  tagline:    'Transforming ideas into digital reality. We provide cutting-edge solutions for your business needs.',
  email:      'contact@digitalemporium.com',
  phone:      '+1 (555) 123-4567',
  address:    '123 Tech Street\nSan Francisco, CA 94105',
  whatsapp:   '15551234567',
};

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { settings, loading } = useSiteSettings();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Datos: BD con fallback a DEFAULTS
  const siteName   = settings?.siteName  || DEFAULTS.siteName;
  const tagline    = settings?.tagline   || DEFAULTS.tagline;
  const footerText = settings?.footerText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const email      = settings?.contactInfo?.email   || settings?.contactEmail   || DEFAULTS.email;
  const phone      = settings?.contactInfo?.phone   || settings?.contactPhone   || DEFAULTS.phone;
  const address    = settings?.contactInfo?.address || settings?.contactAddress || DEFAULTS.address;

  const social         = settings?.socialLinks ?? {};
  const whatsappRaw    = social.whatsapp || DEFAULTS.whatsapp;
  const whatsappNumber = whatsappRaw.replace(/\D/g, '');

  const socialIcons = [
    { key: 'github',    Icon: Github,    href: social.github    },
    { key: 'linkedin',  Icon: Linkedin,  href: social.linkedin  },
    { key: 'twitter',   Icon: Twitter,   href: social.twitter   },
    { key: 'facebook',  Icon: Facebook,  href: social.facebook  },
    { key: 'instagram', Icon: Instagram, href: social.instagram },
    { key: 'youtube',   Icon: Youtube,   href: social.youtube   },
  ].filter(({ href }) => Boolean(href));

  const handleNavigate = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-background to-muted/30 border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {settings?.logo ? (
                <img src={settings.logo} alt={siteName} className="h-8 w-auto object-contain" />
              ) : (
                <div className={`p-2 rounded-lg ${isDark ? 'bg-primary' : 'bg-primary/10'}`}>
                  <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
              )}
              {loading ? (
                <span className="block h-6 w-36 animate-pulse rounded bg-muted" />
              ) : (
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {siteName}
                </span>
              )}
            </div>

            {loading ? (
              <span className="block h-16 w-full animate-pulse rounded bg-muted" />
            ) : (
              <p className="text-muted-foreground text-sm">{tagline}</p>
            )}

            {socialIcons.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialIcons.map(({ key, Icon, href }) => (
                  <motion.a
                    key={key}
                    whileHover={{ scale: 1.1, y: -2 }}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={key}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('home')}</h4>
            <ul className="space-y-2">
              {[
                { label: t('services'), path: '/services' },
                { label: t('projects'), path: '/projects' },
                { label: t('about'),    path: '/about'    },
                { label: t('contact'),  path: '/contact'  },
              ].map(({ label, path }) => (
                <li key={path}>
                  <button
                    onClick={() => handleNavigate(path)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2">
              {['Web Development', 'Mobile Apps', 'AI & Bot Solutions', 'Digital Marketing'].map(s => (
                <li key={s}>
                  <span className="text-muted-foreground text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('contact')}</h4>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-muted animate-pulse shrink-0" />
                    <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <a href={`mailto:${email}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={`tel:${phone}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm whitespace-pre-line">{address}</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {loading
              ? <span className="block h-4 w-64 animate-pulse rounded bg-muted" />
              : footerText}
          </p>
          <div className="flex gap-4">
            {/* ✅ CONECTADO: navega a /privacy */}
            <button
              onClick={() => handleNavigate('/privacy')}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </motion.footer>
  );
}