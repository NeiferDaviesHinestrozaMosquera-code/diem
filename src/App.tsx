import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Home } from '@/pages/Home';
import { Services } from '@/pages/Services';
import { Projects } from '@/pages/Projects';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Quote } from '@/pages/Quote';
import { Login } from '@/pages/admin/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ServicesAdmin } from '@/pages/admin/ServicesAdmin';
import { ProjectsAdmin } from '@/pages/admin/ProjectsAdmin';
import { TestimonialsAdmin } from '@/pages/admin/TestimonialsAdmin';
import { ClientInquiries } from '@/pages/admin/ClientInquiries';
import { SiteSettings } from '@/pages/admin/SiteSettings';
import { PrivacyPolicyAdmin } from '@/pages/admin/PrivacyPolicyAdmin';
import './i18n';
import './App.css';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header público */}
      {!isAdmin && <Header />}

      {/* AdminHeader solo en rutas admin (excepto login) */}
      {isAdmin && !isLoginPage && <AdminHeader />}

      <main className={!isAdmin ? 'pt-20' : ''}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Login admin (pública) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Rutas admin protegidas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ServicesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <ProjectsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <TestimonialsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute>
                <ClientInquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <SiteSettings />
              </ProtectedRoute>
            }
          />

          {/* ✅ NUEVA RUTA: Privacy Policy admin */}
          <Route
            path="/admin/privacy"
            element={
              <ProtectedRoute>
                <PrivacyPolicyAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer solo en rutas públicas */}
      {!isAdmin && <Footer />}

      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;