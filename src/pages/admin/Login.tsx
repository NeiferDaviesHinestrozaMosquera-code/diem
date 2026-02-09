import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!email.trim()) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await login(email, password);

      if (error) {
        // Mensajes de error específicos
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenciales incorrectas. Verifica tu correo y contraseña.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('El correo no ha sido confirmado.');
        } else if (error.message.includes('Too many requests')) {
          toast.error('Demasiados intentos. Por favor espera un momento.');
        } else {
          toast.error('Error al iniciar sesión: ' + error.message);
        }
        return;
      }

      toast.success('¡Bienvenido al panel de administración!');
      
      // Redirigir a la página que intentaba acceder o al dashboard
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error inesperado:', error);
      toast.error('Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5D4E8C]/5 via-background to-[#5D4E8C]/10 p-4">
      {/* Botón volver al inicio */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al inicio</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card principal */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#5D4E8C] to-[#7B6CB3] p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-white/80 text-sm">
              Acceso exclusivo para administradores
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background border-input focus:border-[#5D4E8C] focus:ring-[#5D4E8C]/20"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background border-input focus:border-[#5D4E8C] focus:ring-[#5D4E8C]/20"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#5D4E8C] to-[#7B6CB3] hover:from-[#4A3D70] hover:to-[#6A5CA0] text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Sistema seguro con autenticación JWT</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                El acceso está restringido a usuarios autorizados. 
                Todas las acciones son registradas.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          © {new Date().getFullYear()} Digital Emporium. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
