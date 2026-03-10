import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Stars,
  ChevronRight,
  StarHalf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: Stars },
  { path: '/admin/services', label: 'Servicios', icon: Briefcase },
  { path: '/admin/projects', label: 'Proyectos', icon: FolderOpen },
  { path: '/admin/testimonials', label: 'Testimonios', icon: MessageSquare },
  { path: '/admin/inquiries', label: 'Consultas', icon: Users },
  { path: '/admin/settings', label: 'Configuración', icon: Settings },
  { path: '/admin/privacy', label: 'PrivacyPolicy', icon: StarHalf },
];

// Variantes de animación para el header
const headerVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

// Variantes para cada nav item (entrada escalonada)
const navItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.07,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
};

// Variante para el logo
const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.15, duration: 0.5, ease: 'easeOut' }
  }
};

// Variante para la info de usuario
const userInfoVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.2, duration: 0.5, ease: 'easeOut' }
  }
};

// Menú móvil
const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, scaleY: 0.95 },
  visible: {
    opacity: 1,
    height: 'auto',
    scaleY: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  },
  exit: {
    opacity: 0,
    height: 0,
    scaleY: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' }
  })
};

export function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-r from-[#3D3068] via-[#5D4E8C] to-[#7B6CB3] text-white shadow-xl shadow-[#3D3068]/30 sticky top-0 z-50"
    >
      {/* Línea decorativa animada en la parte superior */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent origin-left"
      />

      {/* Barra superior */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo con animación */}
            <motion.div variants={logoVariants} initial="hidden" animate="visible">
              <Link to="/admin" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </motion.div>
                <div>
                  <h1 className="font-bold text-lg leading-tight">Digital Emporium</h1>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Panel de Control
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Info del usuario + Logout - Desktop */}
            <motion.div
              variants={userInfoVariants}
              initial="hidden"
              animate="visible"
              className="hidden md:flex items-center gap-4"
            >
              <div className="text-right">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-white/60">Administrador</p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 gap-2 border border-white/20 hover:border-white/40 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </motion.div>
            </motion.div>

            {/* Botón menú móvil */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Navegación - Desktop */}
      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={item.path}
                  custom={i}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.path}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 group overflow-hidden
                      ${isActive
                        ? 'bg-white/20 text-white shadow-inner shadow-black/10'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {/* Indicador activo animado */}
                    {isActive && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/20 rounded-lg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <motion.span
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                      className="relative z-10"
                    >
                      <Icon className="h-4 w-4" />
                    </motion.span>
                    <span className="relative z-10">{item.label}</span>

                    {/* Hover underline */}
                    {!isActive && (
                      <motion.span
                        className="absolute bottom-1 left-4 right-4 h-px bg-white/40 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Navegación - Móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t border-white/10 overflow-hidden origin-top"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Info usuario móvil */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 pb-4 border-b border-white/10 mb-3"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  {user?.email?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-white/60">Administrador</p>
                </div>
              </motion.div>

              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={item.path}
                    custom={i}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/75 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <ChevronRight className="h-4 w-4 opacity-60" />
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Logout móvil */}
              <motion.button
                custom={navItems.length}
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  text-white/75 hover:bg-red-500/20 hover:text-white transition-all duration-200 mt-3
                  border-t border-white/10 pt-4"
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesión
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Línea decorativa inferior */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
        className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </motion.header>
  );
}