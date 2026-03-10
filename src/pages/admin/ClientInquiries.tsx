import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, FileText, Clock, Sparkles,
  ChevronLeft, ChevronRight, Download, RefreshCw, Globe,
  CheckCircle, XCircle, AlertCircle,
  ArchiveIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import {
  updateQuoteRequest,
  getQuoteRequests,
} from '@/services/index';
import { supabase } from '@/lib/Client';
import { integratedReportService } from '@/services/integratedReportService';
import { pdfService } from '@/services/pdfService';
import type { QuoteRequest } from '@/types';

export function ClientInquiries() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatingQuoteId, setGeneratingQuoteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'en'>('es');
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 8;

  // Usar useRef para mantener la referencia del selectedQuote sin causar re-renders
  const selectedQuoteRef = useRef<QuoteRequest | null>(null);
  
  useEffect(() => {
    selectedQuoteRef.current = selectedQuote;
  }, [selectedQuote]);

  useEffect(() => {
    let mounted = true;
    
    // Cargar datos iniciales
    const loadInitialData = async () => {
      try {
        console.log('🔄 Cargando datos iniciales...');
        const data = await getQuoteRequests();
        console.log('📊 Datos recibidos:', data.length, 'quotes');
        
        if (mounted) {
          setQuotes(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
        if (mounted) {
          setIsLoading(false);
          toast.error('Failed to load inquiries');
        }
      }
    };

    loadInitialData();

    // Configurar suscripción para actualizaciones en tiempo real
    console.log('📡 Configurando suscripción en tiempo real...');
    const subscription = supabase
      .channel('quote_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
        },
        async (payload: any) => {
          console.log('📡 Cambio detectado:', payload.eventType);
          // Recargar datos cuando hay cambios
          const data = await getQuoteRequests();
          if (mounted) {
            setQuotes(data);
            
            // Actualizar selectedQuote si está abierto
            if (selectedQuoteRef.current) {
              const updatedQuote = data.find(q => q.id === selectedQuoteRef.current!.id);
              if (updatedQuote) {
                setSelectedQuote(updatedQuote);
              }
            }
          }
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Estado de suscripción:', status);
      });
    
    return () => {
      mounted = false;
      console.log('🔌 Desconectando suscripción');
      subscription.unsubscribe();
    };
  }, []);

  const handleGenerateReport = async (quote: QuoteRequest, language: 'es' | 'en' = 'es') => {
    setIsGeneratingReport(true);
    setGeneratingQuoteId(quote.id);

    try {
      toast.info(`Generating AI report in ${language === 'es' ? 'Spanish' : 'English'}...`);

      const result = await integratedReportService.processQuoteRequest(quote, {
        language,
        generatePDF: false,
        uploadPDF: false,
      });

      toast.success('AI report generated successfully!');

      // La suscripción actualizará automáticamente los datos

      // Update selected quote if it's the same one
      if (selectedQuote?.id === quote.id) {
        const updatedQuote = {
          ...quote,
          aiReport: result.aiReport,
          pdfUrl: result.pdfUrl,
          status: 'processed' as const,
        };
        setSelectedQuote(updatedQuote);
      }
    } catch (error) {
      console.error('Error generating AI report:', error);
      toast.error('Failed to generate AI report');
    } finally {
      setIsGeneratingReport(false);
      setGeneratingQuoteId(null);
    }
  };

  const handleRegenerateReport = async (quote: QuoteRequest, language: 'es' | 'en' = 'es') => {
    if (!quote.aiReport) {
      handleGenerateReport(quote, language);
      return;
    }

    setIsGeneratingReport(true);
    setGeneratingQuoteId(quote.id);

    try {
      toast.info('Regenerating AI report...');

      const result = await integratedReportService.regenerateComplete(quote, language, true);

      toast.success('AI report regenerated successfully!');

      // La suscripción actualizará automáticamente los datos

      if (selectedQuote?.id === quote.id) {
        const updatedQuote = {
          ...quote,
          aiReport: result.aiReport,
          pdfUrl: result.pdfUrl,
        };
        setSelectedQuote(updatedQuote);
      }
    } catch (error) {
      console.error('Error regenerating AI report:', error);
      toast.error('Failed to regenerate AI report');
    } finally {
      setIsGeneratingReport(false);
      setGeneratingQuoteId(null);
    }
  };

  const handleTranslateReport = async (quote: QuoteRequest, targetLanguage: 'es' | 'en') => {
    setIsGeneratingReport(true);
    setGeneratingQuoteId(quote.id);

    try {
      toast.info(`Translating report to ${targetLanguage === 'es' ? 'Spanish' : 'English'}...`);

      const result = await integratedReportService.generateTranslation(
        quote,
        targetLanguage,
        true
      );

      toast.success('Report translated successfully!');

      // La suscripción actualizará automáticamente los datos

      if (selectedQuote?.id === quote.id) {
        const updatedQuote = {
          ...quote,
          aiReport: result.aiReport,
          pdfUrl: result.pdfUrl,
        };
        setSelectedQuote(updatedQuote);
      }
    } catch (error) {
      console.error('Error translating report:', error);
      toast.error('Failed to translate report');
    } finally {
      setIsGeneratingReport(false);
      setGeneratingQuoteId(null);
    }
  };

  const handleDownloadPDF = async (quote: QuoteRequest, language: 'es' | 'en' = 'es') => {
    if (!quote.aiReport) {
      toast.error('No AI report available to download');
      return;
    }

    try {
      toast.info('Downloading PDF...');
      pdfService.downloadReportPDF(quote, language);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };



  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await updateQuoteRequest(quoteId, { status: newStatus as any });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;

    try {
      const quote = quotes.find(q => q.id === quoteToDelete);
      
      // Delete PDF if exists
      if (quote?.pdfUrl) {
        try {
          await pdfService.deletePDFFromStorage(quote.pdfUrl);
        } catch (error) {
          console.warn('Failed to delete PDF:', error);
        }
      }

      // Delete quote (you'll need to implement deleteQuoteRequest in supabase.ts)
      // await deleteQuoteRequest(quoteToDelete);
      
      toast.success('Quote deleted successfully');
      setShowDeleteDialog(false);
      setQuoteToDelete(null);
      // La suscripción actualizará automáticamente los datos
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    }
  };

  // Pagination
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'processed': return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'error': return 'bg-red-500/20 text-red-700 dark:text-red-400';
      case 'archived': return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'processed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'archived': return <FileText className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Client Inquiries</h1>
          <p className="text-muted-foreground">Manage quote requests and generate AI reports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Processed</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading inquiries...</span>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: quotes.length, icon: FileText, color: 'bg-blue-500' },
            { 
    label: 'Pending', 
    value: quotes.filter(q => q.status === 'pending').length, 
    icon: Clock, 
    color: 'bg-yellow-500' 
  },
  { 
    label: 'Processing', 
    value: quotes.filter(q => q.status === 'processing').length, 
    icon: RefreshCw, 
    color: 'bg-blue-500' 
  },
  { 
    label: 'Completed', 
    value: quotes.filter(q => q.status === 'completed').length, 
    icon: CheckCircle, 
    color: 'bg-green-500' 
  },
  { 
    label: 'Error', 
    value: quotes.filter(q => q.status === 'error').length, 
    icon: XCircle, 
    color: 'bg-red-500' 
  },
  { 
    label: 'Archived', 
    value: quotes.filter(q => q.status === 'archived').length, 
    icon: ArchiveIcon, 
    color: 'bg-gray-500' 
  },

          { label: 'With AI Reports', value: quotes.filter(q => q.aiReport).length, icon: Sparkles, color: 'bg-purple-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      )}

      {/* Quotes Table */}
      {!isLoading && (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Client</th>
                  <th className="text-left p-4 font-medium">Service</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">AI Report</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {currentQuotes.map((quote, index) => (
                    <motion.tr
                      key={quote.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{quote.fullName}</div>
                          <div className="text-sm text-muted-foreground">{quote.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{quote.service}</span>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusIcon(quote.status)}
                          <span className="capitalize">{quote.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {quote.aiReport ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              {quote.aiReport.language === 'es' ? '🇪🇸' : '🇬🇧'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not generated</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedQuote(quote)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => quote.aiReport 
                              ? handleRegenerateReport(quote, quote.aiReport.language)
                              : handleGenerateReport(quote, selectedLanguage)
                            }
                            disabled={isGeneratingReport && generatingQuoteId === quote.id}
                          >
                            {isGeneratingReport && generatingQuoteId === quote.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                              />
                            ) : quote.aiReport ? (
                              <RefreshCw className="w-4 h-4" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} inquiries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Quote Details Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Quote Details</span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedQuote.status}
                      onValueChange={(value) => handleStatusChange(selectedQuote.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">completed</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Submitted on {new Date(selectedQuote.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Client Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="font-medium">{selectedQuote.fullName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedQuote.email}</p>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <p className="font-medium">{selectedQuote.company || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedQuote.phone}</p>
                  </div>
                  <div>
                    <Label>Service</Label>
                    <p className="font-medium">{selectedQuote.service}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuote.status)}`}>
                      {getStatusIcon(selectedQuote.status)}
                      <span className="capitalize">{selectedQuote.status}</span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <Label>Project Details</Label>
                  <div className="p-4 bg-muted/50 rounded-lg mt-2">
                    <p className="whitespace-pre-wrap">{selectedQuote.projectDetails}</p>
                  </div>
                </div>

                {/* AI Report Actions */}
                <div className="flex flex-wrap gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport(selectedQuote, selectedLanguage)}
                    disabled={isGeneratingReport}
                    variant={selectedQuote.aiReport ? 'outline' : 'default'}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {selectedQuote.aiReport ? 'Regenerate Report' : 'Generate AI Report'}
                  </Button>

                  {selectedQuote.aiReport && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(selectedQuote, selectedQuote.aiReport!.language)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTranslateReport(
                          selectedQuote,
                          selectedQuote.aiReport!.language === 'es' ? 'en' : 'es'
                        )}
                        disabled={isGeneratingReport}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Translate to {selectedQuote.aiReport.language === 'es' ? 'English' : 'Spanish'}
                      </Button>

                      {selectedQuote.pdfUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedQuote.pdfUrl, '_blank')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                      )}
                    </>
                  )}

                  {!selectedQuote.aiReport && (
                    <Select value={selectedLanguage} onValueChange={(value: 'es' | 'en') => setSelectedLanguage(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* AI Report Display */}
                {selectedQuote.aiReport && (
                  <div className="p-6 border border-primary/20 rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Generated Report
                      <span className="text-sm font-normal text-muted-foreground">
                        ({selectedQuote.aiReport.language === 'es' ? '🇪🇸 Spanish' : '🇬🇧 English'})
                      </span>
                    </h4>

                    {/* Key Metrics Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-card rounded-lg border">
                        <Label className="text-xs text-muted-foreground">Estimated Time</Label>
                        <p className="font-bold text-lg mt-1">{selectedQuote.aiReport.estimatedTime}</p>
                      </div>
                      <div className="p-4 bg-card rounded-lg border">
                        <Label className="text-xs text-muted-foreground">Total Cost</Label>
                        <p className="font-bold text-lg text-green-600 mt-1">
                          ${selectedQuote.aiReport.totalCost.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-card rounded-lg border">
                        <Label className="text-xs text-muted-foreground">Difficulty</Label>
                        <p className="font-bold text-lg capitalize mt-1">
                          {selectedQuote.aiReport.difficultyLevel}
                        </p>
                      </div>
                      <div className="p-4 bg-card rounded-lg border">
                        <Label className="text-xs text-muted-foreground">Team Size</Label>
                        <p className="font-bold text-lg mt-1">
                          {selectedQuote.aiReport.requiredTeamMembers} members
                        </p>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="mb-6">
                      <Label className="font-semibold mb-3 block">Cost Breakdown</Label>
                      <div className="space-y-2 p-4 bg-card rounded-lg border">
                        {[
                          { label: 'Development', value: selectedQuote.aiReport.partialCosts.development },
                          { label: 'Design', value: selectedQuote.aiReport.partialCosts.design },
                          { label: 'Testing', value: selectedQuote.aiReport.partialCosts.testing },
                          { label: 'Deployment', value: selectedQuote.aiReport.partialCosts.deployment },
                          selectedQuote.aiReport.partialCosts.projectManagement && {
                            label: 'Project Management',
                            value: selectedQuote.aiReport.partialCosts.projectManagement
                          },
                          selectedQuote.aiReport.partialCosts.maintenance && {
                            label: 'Maintenance',
                            value: selectedQuote.aiReport.partialCosts.maintenance
                          },
                        ].filter(Boolean).map((item: any) => (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-semibold">${item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <Label className="font-semibold mb-3 block">Recommended Technologies</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuote.aiReport.recommendedTechnologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {selectedQuote.aiReport.recommendations && selectedQuote.aiReport.recommendations.length > 0 && (
                      <div className="mb-6">
                        <Label className="font-semibold mb-3 block">Recommendations</Label>
                        <ul className="space-y-2 p-4 bg-card rounded-lg border">
                          {selectedQuote.aiReport.recommendations.map((rec, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-primary font-bold">{index + 1}.</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Milestones */}
                    {selectedQuote.aiReport.milestones && selectedQuote.aiReport.milestones.length > 0 && (
                      <div className="mb-6">
                        <Label className="font-semibold mb-3 block">Project Milestones</Label>
                        <ul className="space-y-2 p-4 bg-card rounded-lg border">
                          {selectedQuote.aiReport.milestones.map((milestone, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-primary font-bold">{index + 1}.</span>
                              <span>{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {selectedQuote.aiReport.additionalNotes && (
                      <div>
                        <Label className="font-semibold mb-3 block">Additional Notes</Label>
                        <div className="p-4 bg-card rounded-lg border">
                          <p className="text-muted-foreground">{selectedQuote.aiReport.additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quote request
              and all associated data including AI reports and PDFs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuoteToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}