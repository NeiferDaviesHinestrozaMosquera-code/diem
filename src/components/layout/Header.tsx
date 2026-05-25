import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Palette, Codesandbox } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, isDark } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('services'), href: '/services' },
    { label: t('projects'), href: '/projects' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
    { label: t('quote'), href: '/quote' },
  ];

  const adminNavItems = [
    { label: t('dashboard'), href: '/admin' },
    { label: t('manageServices'), href: '/admin/services' },
    { label: t('manageProjects'), href: '/admin/projects' },
    { label: t('manageTestimonials'), href: '/admin/testimonials' },
    { label: t('clientInquiries'), href: '/admin/inquiries' },
    { label: t('siteSettings'), href: '/admin/settings' },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isAdmin
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(isAdmin ? '/admin' : '/')}
            >
              <motion.div
                className={`p-2 rounded-lg ${isDark ? 'bg-primary' : 'bg-primary/10'}`}
                animate={{ rotate: isScrolled ? 0 : 360 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Codesandbox className={`w-6 h-6 ${isDark ? 'text-primary-foreground' : 'text-primary'}`} />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Digital Emporium
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {(isAdmin ? adminNavItems : navItems).map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, type: 'spring', stiffness: 150 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {item.label}
                  {/* Active indicator dot */}
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <button 
                  className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-accent transition-colors min-w-[44px] min-h-[44px]"
                  aria-label="Cambiar tema de color"
                >
                  <motion.div
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Palette className="w-4 h-4" />
                  </motion.div>
                </button>
                <div className="absolute top-full right-0 mt-2 py-1 bg-popover rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
                  <button
                    onClick={() => setTheme('light')}
                    aria-label="Cambiar a tema claro"
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${theme === 'light' ? 'bg-accent' : ''}`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    aria-label="Cambiar a tema oscuro"
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${theme === 'dark' ? 'bg-accent' : ''}`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    aria-label="Usar tema del sistema"
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-accent ${theme === 'system' ? 'bg-accent' : ''}`}
                  >
                    💻 System
                  </button>
                </div>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-blue-500 to-purple-600"
        />

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border"
            >
              <nav className="flex flex-col p-4 gap-2">
                {(isAdmin ? adminNavItems : navItems).map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(item.href)}
                    className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {/* Language Switcher in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 px-4"
                >
                  <LanguageSwitcher />
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
}

export default Header;