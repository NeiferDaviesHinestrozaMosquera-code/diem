import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code, Bot, Smartphone, Megaphone, PenTool, ShoppingCart,
  Share2, Palette, Globe, Database, Cloud, Lock,
  ArrowRight, Check, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { getServices, subscribeToServices } from '@/services/supabase';
import type { Service } from '@/types';

// Mapeo de nombres de iconos a componentes de Lucide
const iconMap: Record<string, any> = {
  Code,
  Bot,
  Smartphone,
  Megaphone,
  PenTool,
  ShoppingCart,
  Share2,
  Palette,
  Globe,
  Database,
  Cloud,
  Lock,
};

export function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar servicios al montar el componente
  useEffect(() => {
    loadServices();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToServices((updatedServices) => {
      setServices(updatedServices);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-0">
      {/* Header */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('servicesTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('servicesSubtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Loading State */}
      {isLoading ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">{t('loadingServices') || 'Loading services...'}</p>
            </div>
          </div>
        </section>
      ) : services.length === 0 ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('noServices') || 'No Services Available'}</h3>
              <p className="text-muted-foreground max-w-md">
                {t('noServicesDescription') || 'Services are being updated. Please check back soon!'}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Services Grid */}
          <section className="py-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service, index) => {
                  // Obtener el componente del icono desde el mapa
                  const IconComponent = iconMap[service.icon] || Code;

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10 }}
                      className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedService(service)}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <motion.img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                          className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center shadow-lg"
                        >
                          <IconComponent className="w-6 h-6 text-primary-foreground" />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-semibold">{service.price}</span>
                          <motion.span
                            whileHover={{ x: 5 }}
                            className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors"
                          >
                            {t('viewDetails')}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </motion.span>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedService && (() => {
            const ModalIconComponent = iconMap[selectedService.icon] || Code;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ModalIconComponent className="w-6 h-6 text-primary" />
                    </div>
                    {selectedService.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                  <motion.img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-52 object-cover rounded-xl mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedService.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-6">Details</h4>
                  <p className="text-muted-foreground mb-3">{selectedService.longDescription}</p>


                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <span className="text-sm text-muted-foreground">Starting from</span>
                      <div className="text-2xl font-bold text-primary">{selectedService.price}</div>
                    </div>
                    <Button
                      onClick={() => {
                        const serviceTitle = selectedService.title;
                        setSelectedService(null);
                        navigate('/quote', { state: { service: serviceTitle } });
                      }}
                    >
                      Get Quote
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}