import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  Eye,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  getServices,
  getProjects,
  getTestimonials,
  getQuoteRequests,
  subscribeToServices,
  subscribeToProjects,
  subscribeToTestimonials,
  subscribeToQuoteRequests,
} from '@/services/supabase';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const quickLinks = [
  { path: '/admin/services',     label: 'Gestionar Servicios', icon: Briefcase,     color: 'bg-blue-500'   },
  { path: '/admin/projects',     label: 'Gestionar Proyectos', icon: FolderOpen,    color: 'bg-green-500'  },
  { path: '/admin/testimonials', label: 'Ver Testimonios',     icon: MessageSquare, color: 'bg-purple-500' },
  { path: '/admin/inquiries',    label: 'Ver Consultas',       icon: Users,         color: 'bg-orange-500' },
  { path: '/admin/settings',     label: 'Configuración',       icon: Settings,      color: 'bg-gray-500'   },
];

interface StatsState {
  services:      number;
  projects:      number;
  testimonials:  number;
  pendingQuotes: number;
  loading:       boolean;
}

function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [value, loading]);

  if (loading) {
    return <span className="inline-block w-8 h-8 bg-muted animate-pulse rounded" />;
  }

  return <span>{display}</span>;
}

export function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<StatsState>({
    services:      0,
    projects:      0,
    testimonials:  0,
    pendingQuotes: 0,
    loading:       true,
  });

  useEffect(() => {
    Promise.all([
      getServices(),
      getProjects(),
      getTestimonials(),
      getQuoteRequests(),
    ])
      .then(([services, projects, testimonials, quotes]) => {
        setStats({
          services:      services.length,
          projects:      projects.length,
          testimonials:  testimonials.length,
          pendingQuotes: quotes.filter(q => q.status === 'pending').length,
          loading:       false,
        });
      })
      .catch(() => setStats(prev => ({ ...prev, loading: false })));

    const unsubServices = subscribeToServices(services =>
      setStats(prev => ({ ...prev, services: services.length }))
    );
    const unsubProjects = subscribeToProjects(projects =>
      setStats(prev => ({ ...prev, projects: projects.length }))
    );
    const unsubTestimonials = subscribeToTestimonials(testimonials =>
      setStats(prev => ({ ...prev, testimonials: testimonials.length }))
    );
    const unsubQuotes = subscribeToQuoteRequests(quotes =>
      setStats(prev => ({
        ...prev,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
      }))
    );

    return () => {
      unsubServices();
      unsubProjects();
      unsubTestimonials();
      unsubQuotes();
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4E8C]" />
      </div>
    );
  }

  const statCards = [
    { label: 'Servicios Activos',    value: stats.services,      icon: Briefcase,     trend: 'Total registrados', path: '/admin/services'     },
    { label: 'Proyectos',            value: stats.projects,      icon: FolderOpen,    trend: 'Total registrados', path: '/admin/projects'     },
    { label: 'Testimonios',          value: stats.testimonials,  icon: MessageSquare, trend: 'Total registrados', path: '/admin/testimonials' },
    { label: 'Consultas Pendientes', value: stats.pendingQuotes, icon: Users,         trend: 'Sin procesar',      path: '/admin/inquiries'    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Bienvenida */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            ¡Bienvenido, Administrador 💙 💚 🤍!
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-muted-foreground">
              {user?.email} • Último acceso:{' '}
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
              bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
              text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              En tiempo real
            </span>
          </div>
        </motion.div>

        {/* Cards de estadísticas */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => navigate(stat.path)}
                    className="hover:shadow-lg transition-all cursor-pointer
                      border-l-4 border-l-[#5D4E8C]/20 hover:border-l-[#5D4E8C]
                      hover:bg-[#5D4E8C]/[0.02]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold mt-2 tabular-nums">
                            <AnimatedNumber value={stat.value} loading={stats.loading} />
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            {stat.trend}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-[#5D4E8C]/10 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="h-6 w-6 text-[#5D4E8C]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
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
                      className="h-auto py-4 px-6 justify-start gap-4
                        hover:bg-[#5D4E8C]/5 hover:border-[#5D4E8C]/30 transition-all"
                      onClick={() => navigate(link.path)}
                    >
                      <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center shrink-0`}>
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

        {/* Estado del sistema */}
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
                  {[
                    { label: 'Base de datos', status: 'Conectada'  },
                    { label: 'Autenticación', status: 'Activa'     },
                    { label: 'Storage',       status: 'Disponible' },
                    { label: 'Tiempo real',   status: stats.loading ? 'Conectando...' : 'Activo' },
                  ].map(({ label, status }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}