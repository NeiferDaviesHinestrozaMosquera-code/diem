import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, ArrowRight, MessageCircle,
  Clock, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '@/hooks/use-siteSettings';



export function Contact() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings, loading } = useSiteSettings();

  // Datos: BD sin fallback a DEFAULTS
  const siteName    = settings?.siteName;
  const contactText = settings?.contactText;
  const email       = settings?.contactInfo?.email   || settings?.contactEmail;
  const phone       = settings?.contactInfo?.phone   || settings?.contactPhone;
  const address     = settings?.contactInfo?.address || settings?.contactAddress;

  const whatsappHref   = `https://wa.me/${phone}`;

  const contactItems = [
    {
      Icon: Mail,
      title: 'Email',
      content: email,
      description: 'Send us an email anytime',
      color: 'from-blue-500 to-blue-600',
      href: `mailto:${email}`,
    },
    {
      Icon: Phone,
      title: 'Phone',
      content: phone,
      description: 'Mon–Fri from 8am to 5pm',
      color: 'from-green-500 to-green-600',
      href: `tel:${phone}`,
    },
    {
      Icon: MapPin,
      title: 'Address',
      content: address,
      description: 'Visit our office',
      color: 'from-purple-500 to-purple-600',
      href: undefined,
    },
  ];

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
              {t('contactTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {loading ? (
              <span className="block h-5 w-72 mx-auto animate-pulse rounded bg-muted" />
            ) : (
              contactText || t('contactSubtitle')
            )}
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {loading
              ? [1, 2, 3].map(i => (
                  <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
                ))
              : contactItems.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="group h-full border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                      <CardContent className="p-6 relative">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${info.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                        <div className="relative z-10">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <info.Icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{info.title}</h3>
                          {info.href ? (
                            <a href={info.href} className="text-primary font-medium mb-2 hover:underline block">
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-primary font-medium mb-2">{info.content}</p>
                          )}
                          <p className="text-muted-foreground text-sm">{info.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>

          {/* Working Hours + Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Working Hours</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
                      { day: 'Saturday',        hours: '9:00 AM - 2:00 PM' },
                      { day: 'Sunday',          hours: 'Closed' },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-muted-foreground">{day}</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Schedule a Call</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Book a free consultation to discuss your project needs with our experts.
                  </p>
                  <Button onClick={() => navigate('/quote')} className="w-full">
                    Book Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Prefer WhatsApp?</h4>
                  <p className="text-sm text-muted-foreground">Chat with us instantly</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => window.open(whatsappHref, '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Chat on WhatsApp
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1200&q=80')" }}
              />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <MapPin className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <div className="absolute bottom-4 left-4 right-4 p-4 bg-background/90 backdrop-blur-sm rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{siteName} HQ</h4>
                    <p className="text-sm text-muted-foreground">
                      {loading
                        ? <span className="block h-4 w-48 animate-pulse rounded bg-muted" />
                        : address}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.google.com/maps/place/Servibanca/@4.6842317,-74.08096,19z/data=!4m6!3m5!1s0x8e3f9ba6c6cb435d:0xc1e29e0434474530!8m2!3d4.684057!4d-74.080402!16s%2Fg%2F11h7g4p6z5?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D', '_blank')}
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}