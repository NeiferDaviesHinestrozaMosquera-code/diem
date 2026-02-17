import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  TrendingUp,
  Eye,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AdminHeader } from '@/components/layout/AdminHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const quickLinks = [
  { path: '/admin/services', label: 'Gestionar Servicios', icon: Briefcase, color: 'bg-blue-500' },
  { path: '/admin/projects', label: 'Gestionar Proyectos', icon: FolderOpen, color: 'bg-green-500' },
  { path: '/admin/testimonials', label: 'Ver Testimonios', icon: MessageSquare, color: 'bg-purple-500' },
  { path: '/admin/inquiries', label: 'Ver Consultas', icon: Users, color: 'bg-orange-500' },
  { path: '/admin/settings', label: 'Configuración', icon: Settings, color: 'bg-gray-500' },
];

const stats = [
  { label: 'Servicios Activos', value: '0', icon: Briefcase, trend: '+0%' },
  { label: 'Proyectos', value: '0', icon: FolderOpen, trend: '+0%' },
  { label: 'Testimonios', value: '0', icon: MessageSquare, trend: '+0%' },
  { label: 'Consultas Pendientes', value: '0', icon: Users, trend: '0 nuevas' },
];

export function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no está autenticado (capa extra de seguridad)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4E8C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header de bienvenida */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              ¡Bienvenido, Administrador💙 💚  🤍!
            </h1>
            <p className="text-muted-foreground">
              {user?.email} • Último acceso: {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>

          {/* Estadísticas */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold mt-2">{stat.value}</p>
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {stat.trend}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-[#5D4E8C]/10 rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-[#5D4E8C]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Accesos rápidos */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-[#5D4E8C]" />
                  Accesos Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto py-4 px-6 justify-start gap-4 hover:bg-[#5D4E8C]/5 hover:border-[#5D4E8C]/30 transition-all"
                        onClick={() => navigate(link.path)}
                      >
                        <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">{link.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información del sistema */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-[#5D4E8C]" />
                    Vista Previa del Sitio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Visualiza cómo se ve tu sitio web para los visitantes.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Sitio Público
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#5D4E8C]" />
                    Estado del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Base de datos</span>
                      <span className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Conectada
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Autenticación</span>
                      <span className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Activa
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Disponible
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
