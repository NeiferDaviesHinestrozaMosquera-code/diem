import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/services', label: 'Servicios', icon: Briefcase },
  { path: '/admin/projects', label: 'Proyectos', icon: FolderOpen },
  { path: '/admin/testimonials', label: 'Testimonios', icon: MessageSquare },
  { path: '/admin/inquiries', label: 'Consultas', icon: Users },
  { path: '/admin/settings', label: 'Configuración', icon: Settings },
];

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
    <header className="bg-gradient-to-r from-[#5D4E8C] to-[#7B6CB3] text-white shadow-lg">
      {/* Barra superior */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">DIEM Admin</h1>
                <p className="text-xs text-white/70">Panel de Control</p>
              </div>
            </Link>

            {/* Info del usuario - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-white/70">Administrador</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20 gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>

            {/* Botón menú móvil */}
            <button
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navegación - Desktop */}
      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Navegación - Móvil */}
      {isMobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-2">
            {/* Info del usuario - Móvil */}
            <div className="pb-4 border-b border-white/10 mb-4">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-white/70">Administrador</p>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Logout - Móvil */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 mt-4
                border-t border-white/10 pt-4"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </motion.nav>
      )}
    </header>
  );
}
