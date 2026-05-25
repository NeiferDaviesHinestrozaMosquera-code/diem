import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Spinner } from '@/components/ui/spinner';

const CustomCursor = lazy(() => import('@/components/ui/CustomCursor').then(m => ({ default: m.CustomCursor })));
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Services = lazy(() => import('@/pages/Services').then(m => ({ default: m.Services })));
const Projects = lazy(() => import('@/pages/Projects').then(m => ({ default: m.Projects })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const Quote = lazy(() => import('@/pages/Quote').then(m => ({ default: m.Quote })));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('@/pages/TermsofServices').then(m => ({ default: m.TermsOfService })));

const Login = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.Dashboard })));
const ServicesAdmin = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.ServicesAdmin })));
const ProjectsAdmin = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.ProjectsAdmin })));
const TestimonialsAdmin = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.TestimonialsAdmin })));
const ClientInquiries = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.ClientInquiries })));
const SiteSettings = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.SiteSettings })));
const PrivacyPolicyAdmin = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.PrivacyPolicyAdmin })));
const TeamAdmin = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.TeamAdmin })));
const TermsAdmin = lazy(() => import('@/pages/admin/AllAdmin').then(m => ({ default: m.TermsAdmin })));
import './i18n';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
      {!isAdmin && <Header />}
      {isAdmin && !isLoginPage && <AdminHeader />}

      <main className={!isAdmin ? 'pt-0' : ''}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Spinner className="w-8 h-8 text-primary" /></div>}>
            <Routes location={location} key={location.pathname}>
              {/* Rutas públicas */}
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
              <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/quote" element={<PageTransition><Quote /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
              <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />

              {/* Login admin (pública) */}
              <Route path="/admin/login" element={<Login />} />

              {/* Rutas admin protegidas */}
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute><ServicesAdmin /></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute><ProjectsAdmin /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><TestimonialsAdmin /></ProtectedRoute>} />
              <Route path="/admin/inquiries" element={<ProtectedRoute><ClientInquiries /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />
              <Route path="/admin/privacy" element={<ProtectedRoute><PrivacyPolicyAdmin /></ProtectedRoute>} />
              <Route path="/admin/team" element={<ProtectedRoute><TeamAdmin /></ProtectedRoute>} />
              <Route path="/admin/terms" element={<ProtectedRoute><TermsAdmin /></ProtectedRoute>} />

              {/* Catch-all → redirige a home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

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