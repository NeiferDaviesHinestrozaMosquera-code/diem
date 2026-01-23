import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { Services } from '@/pages/Services';
import { Projects } from '@/pages/Projects';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Quote } from '@/pages/Quote';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ServicesAdmin } from '@/pages/admin/ServicesAdmin';
import { ProjectsAdmin } from '@/pages/admin/ProjectsAdmin';
import { TestimonialsAdmin } from '@/pages/admin/TestimonialsAdmin';
import { ClientInquiries } from '@/pages/admin/ClientInquiries';
import { SiteSettings } from '@/pages/admin/SiteSettings';

// Nuevos componentes para efectos parallax y animaciones
import { CursorFollower } from '@/components/effects/CursorFollower';
import { ParallaxBackground } from '@/components/effects/ParallaxBackground';

import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Add/remove admin class on body
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-page');
    } else {
      document.body.classList.remove('admin-page');
    }
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Cursor Personalizado - Solo en páginas públicas */}
      {!isAdmin && <CursorFollower />}
      
      {/* Background con efectos parallax - Solo en páginas públicas */}
      {!isAdmin && <ParallaxBackground />}

      {/* Header */}
      <Header isAdmin={isAdmin} />
      
      {/* Main Content */}
      <main className={isAdmin ? '' : 'pt-20 relative z-10'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/services" element={<ServicesAdmin />} />
          <Route path="/admin/projects" element={<ProjectsAdmin />} />
          <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
          <Route path="/admin/inquiries" element={<ClientInquiries />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
        </Routes>
      </main>
      
      {/* Footer - Solo en páginas públicas */}
      {!isAdmin && <Footer />}
      
      {/* Toaster para notificaciones */}
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;