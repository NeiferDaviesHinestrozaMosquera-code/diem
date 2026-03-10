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
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { TermsOfService } from '@/pages/TermsofServices';
import {
  Login,
  Dashboard,
  ServicesAdmin,
  ProjectsAdmin,
  TestimonialsAdmin,
  ClientInquiries,
  SiteSettings,
  PrivacyPolicyAdmin,
  TeamAdmin,
  TermsAdmin,
} from '@/pages/admin/AllAdmin';
import './i18n';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isAdmin && <Header />}
      {isAdmin && !isLoginPage && <AdminHeader />}

      <main className={!isAdmin ? 'pt-0' : ''}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

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
        </Routes>
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