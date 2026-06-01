import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero NO es administrador
  const isAdmin = user?.app_metadata?.role === 'admin';
  if (!isAdmin) {
    // Es posible que no deba usar hooks dentro del if, así que usar Navigate de forma limpia.
    // Mostraríamos un mensaje pero Navigate es renderizado directo
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y es admin, mostrar el contenido protegido
  return <>{children}</>;
}
