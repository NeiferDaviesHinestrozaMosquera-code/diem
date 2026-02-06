import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, Image as ImageIcon,
  Search, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  getServices, addService, updateService, deleteService,
  uploadImage, deleteImage
} from '@/services/supabase';
import type { Service } from '@/types';

export function ServicesAdmin() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    icon: 'Code',
    image: '',
    price: '',
    features: [''],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP, SVG)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        const uploadToast = toast.loading('Uploading image...');
        try {
          imageUrl = await uploadImage(imageFile, `services/${Date.now()}`);
          toast.dismiss(uploadToast);
        } catch (error) {
          toast.dismiss(uploadToast);
          throw error;
        }
      }

      const serviceData = {
        ...formData,
        image: imageUrl,
        features: formData.features.filter(f => f.trim() !== ''),
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
        toast.success('Service updated successfully');
      } else {
        await addService(serviceData);
        toast.success('Service added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadServices();
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      longDescription: service.longDescription,
      icon: service.icon,
      image: service.image,
      price: service.price,
      features: service.features.length > 0 ? service.features : [''],
    });
    setImagePreview(service.image);
    setIsDialogOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        if (service.image) {
          await deleteImage(service.image);
        }
        await deleteService(service.id);
        toast.success('Service deleted successfully');
        loadServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      icon: 'Code',
      image: '',
      price: '',
      features: [''],
    });
    setEditingService(null);
    setImageFile(null);
    setImagePreview('');
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  // Pagination
  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const iconOptions = [
    'Code', 'Bot', 'Smartphone', 'Megaphone', 'PenTool', 'ShoppingCart',
    'Share2', 'Palette', 'Globe', 'Database', 'Cloud', 'Lock',
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('manageServices')}</h1>
          <p className="text-muted-foreground">{t('servicesSubtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10"
            />
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="w-full sm:w-auto">
            <Plus className="mr-2 w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-xl"></div>
              <div className="p-4 space-y-3 bg-card rounded-b-xl border border-t-0">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentServices.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-lg mb-2">No services found</p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Add your first service to get started'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Add Service
                  </Button>
                )}
              </div>
            ) : (
              currentServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(service)}
                        className="p-2 shadow-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(service)}
                        className="p-2 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold">{service.price}</span>
                      <span className="text-xs text-muted-foreground">
                        {service.features.length} feature{service.features.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredServices.length)} of {filteredServices.length} services
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
        </>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Web Development"
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="From $1,000"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-3 rounded-lg border transition-colors ${
                      formData.icon === icon
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    title={icon}
                  >
                    <span className="text-2xl">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Service Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 800x600px, max 5MB (JPEG, PNG, WebP, SVG)
              </p>
              {(imagePreview || formData.image) && (
                <div className="mt-3 relative inline-block">
                  <img 
                    src={imagePreview || formData.image} 
                    alt="Preview" 
                    className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-border" 
                  />
                  {imagePreview && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label>Short Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={2}
                placeholder="Brief overview of the service (max 160 characters)"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/160 characters
              </p>
            </div>

            <div>
              <Label>Full Description *</Label>
              <Textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                required
                rows={4}
                placeholder="Detailed description of the service and what's included"
              />
            </div>

            <div>
              <Label>Features</Label>
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Add Feature
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 w-4 h-4" />
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
