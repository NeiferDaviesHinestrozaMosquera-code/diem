import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, ArrowRight, CheckCircle, User, Mail, Building2, Phone,
  Briefcase, MessageSquare, Sparkles, FileDown, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addQuoteRequest } from '@/services/supabase';
import { integratedReportService } from '@/services/integratedReportService';
import { toast } from 'sonner';
import type { QuoteRequest } from '@/types';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  service: z.string().min(1, 'Please select a service'),
  projectDetails: z.string().min(10, 'Please provide project details'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const services = [
  'Web Development',
  'AI & Bot Solutions',
  'Mobile App Development',
  'Digital Marketing',
  'Content & Copywriting',
  'E-Commerce Solutions',
  'Social Media Management',
  'UI/UX Design',
  'Cloud Services',
  'Database Solutions',
  'Web Security',
  'Other',
];

interface SubmissionResult {
  quoteRequestId: string;
  aiReportGenerated: boolean;
  pdfGenerated: boolean;
  pdfUrl?: string;
}

export function Quote() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [autoGenerateAI, setAutoGenerateAI] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'en'>('es');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      // Paso 1: Crear la solicitud de cotización
      toast.info('Submitting quote request...');
      const quoteRequestId = await addQuoteRequest(data);
      
      let result: SubmissionResult = {
        quoteRequestId,
        aiReportGenerated: false,
        pdfGenerated: false,
      };

      // Paso 2: Generar reporte AI automáticamente si está habilitado
      if (autoGenerateAI) {
        try {
          toast.info('Generating AI report...');
          
          // Obtener el quote request completo (simulado, ya que acabamos de crearlo)
          const quoteRequest: QuoteRequest = {
            id: quoteRequestId,
            ...data,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Generar el reporte AI y PDF
          const aiResult = await integratedReportService.processQuoteRequest(
            quoteRequest,
            {
              language: selectedLanguage,
              generatePDF: true,
              uploadPDF: true,
            }
          );

          result.aiReportGenerated = true;
          result.pdfGenerated = !!aiResult.pdfUrl;
          result.pdfUrl = aiResult.pdfUrl;

          toast.success('AI report generated successfully!');
        } catch (aiError) {
          console.error('Error generating AI report:', aiError);
          toast.warning('Quote submitted, but AI report generation failed. Our team will create it manually.');
        }
      }

      setSubmissionResult(result);
      setIsSubmitted(true);
      toast.success('Quote request submitted successfully!');
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-4 text-center">Thank You!</h2>
          <p className="text-muted-foreground mb-6 text-center">
            We've received your quote request and will get back to you within 24 hours.
          </p>

          {/* AI Report Status */}
          {submissionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-6 bg-card border border-border rounded-xl space-y-4"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Submission Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quote Request</span>
                  <span className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Submitted
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Report</span>
                  <span className={`flex items-center gap-2 font-medium ${
                    submissionResult.aiReportGenerated ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {submissionResult.aiReportGenerated ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Generated
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        In Progress
                      </>
                    )}
                  </span>
                </div>

                {submissionResult.pdfGenerated && submissionResult.pdfUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PDF Report</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(submissionResult.pdfUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>

              {submissionResult.aiReportGenerated && (
                <p className="text-sm text-muted-foreground pt-3 border-t">
                  🎉 Great news! We've automatically generated an AI-powered analysis of your project. 
                  Check your email for the complete report.
                </p>
              )}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} variant="outline">
              Back to Home
            </Button>
            {submissionResult?.pdfUrl && (
              <Button
                onClick={() => window.open(submissionResult.pdfUrl, '_blank')}
                className="bg-gradient-to-r from-primary to-blue-600"
              >
                <FileDown className="mr-2 w-4 h-4" />
                View Full Report
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
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
              {t('quoteTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('quoteSubtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Form */}
      <section className="py-10 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background Decoration */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative z-10 space-y-6 p-8 rounded-2xl bg-card border border-border shadow-xl"
            >
              {/* AI Features Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">AI-Powered Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Get an instant AI-generated report with cost estimates, timeline, and technology recommendations.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Name & Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    {t('fullName')} *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    {...register('fullName')}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </motion.div>
              </div>

              {/* Company & Phone Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="company" className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    Company (Optional)
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your Company"
                    {...register('company')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </motion.div>
              </div>

              {/* Service Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Label className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4" />
                  Service of Interest *
                </Label>
                <Select onValueChange={(value) => setValue('service', value)}>
                  <SelectTrigger className={errors.service ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                )}
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="projectDetails" className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Project Details *
                </Label>
                <Textarea
                  id="projectDetails"
                  placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                  rows={6}
                  {...register('projectDetails')}
                  className={errors.projectDetails ? 'border-red-500' : ''}
                />
                {errors.projectDetails && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectDetails.message}</p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Need help choosing the right service?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is here to help you identify the best solution for your needs.
              Schedule a free consultation to discuss your project.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/contact')}
                variant="outline"
              >
                Contact Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}