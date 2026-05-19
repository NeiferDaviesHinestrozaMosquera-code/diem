import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingBag, Mail, Phone, MapPin,
  Github, Linkedin, Twitter, Facebook, Instagram,
  Youtube, MessageCircle, ArrowUp,
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

// Stagger container variant
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const linkHoverVariants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
};

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { settings, loading } = useSiteSettings();

  // Scroll-to-top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Parallax for footer background
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0.8, 1], [30, 0]);
  const backgroundOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 0.08]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="bg-gradient-to-b from-background to-muted/30 border-t border-border relative overflow-hidden"
    >
      {/* Animated background decoration */}
      <motion.div
        style={{ y: backgroundY, opacity: backgroundOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[150px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <motion.div variants={columnVariants} className="space-y-4">
            <div className="flex items-center gap-2">
              {settings?.logo ? (
                <motion.img
                  src={settings.logo}
                  alt={siteName}
                  className="h-8 w-auto object-contain"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                />
              ) : (
                <motion.div
                  className={`p-2 rounded-lg ${isDark ? 'bg-primary' : 'bg-primary/10'}`}
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-primary-foreground' : 'text-primary'}`} />
                </motion.div>
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
                {socialIcons.map(({ key, Icon, href }, index) => (
                  <motion.a
                    key={key}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.08, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.2, y: -4, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
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
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={columnVariants}>
            <h4 className="font-semibold mb-4">{t('home')}</h4>
            <ul className="space-y-2">
              {[
                { label: t('services'), path: '/services' },
                { label: t('projects'), path: '/projects' },
                { label: t('about'),    path: '/about'    },
                { label: t('contact'),  path: '/contact'  },
              ].map(({ label, path }) => (
                <li key={path}>
                  <motion.button
                    variants={linkHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    onClick={() => handleNavigate(path)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                  >
                    <motion.span
                      className="inline-block w-0 overflow-hidden"
                      variants={{
                        rest: { width: 0, opacity: 0 },
                        hover: { width: 'auto', opacity: 1, transition: { duration: 0.2 } },
                      }}
                    >
                      →
                    </motion.span>
                    {label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={columnVariants}>
            <h4 className="font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2">
              {['Web Development', 'Mobile Apps', 'AI & Bot Solutions', 'Digital Marketing'].map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <span className="text-muted-foreground text-sm">{s}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={columnVariants}>
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
                {[
                  { Icon: Mail,   content: email,   href: `mailto:${email}` },
                  { Icon: Phone,  content: phone,   href: `tel:${phone}` },
                  { Icon: MapPin, content: address, href: undefined },
                ].map(({ Icon, content, href }, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="mt-0.5 shrink-0"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                    </motion.div>
                    {href ? (
                      <a href={href} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                        {content}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm whitespace-pre-line">{content}</span>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-muted-foreground text-sm">
            {loading
              ? <span className="block h-4 w-64 animate-pulse rounded bg-muted" />
              : footerText}
          </p>
          <div className="flex gap-4">
            {/* ✅ CONECTADO: navega a /privacy */}
            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => handleNavigate('/privacy')}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </motion.button>

            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => handleNavigate('/terms')}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* WhatsApp Float Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full bg-green-500"
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <MessageCircle className="w-6 h-6 relative z-10" />
      </motion.a>

      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.15, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-24 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.footer>
  );
}