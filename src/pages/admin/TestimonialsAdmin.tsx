import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, Star, Quote,
  Search, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
  uploadImage, deleteImage
} from '@/services/index';
import type { Testimonial } from '@/types';

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  // Form states
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB for avatars
    if (file.size > maxSize) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.content.length < 20) {
      toast.error('Testimonial content must be at least 20 characters');
      return;
    }

    if (formData.content.length > 500) {
      toast.error('Testimonial content must be less than 500 characters');
      return;
    }
    
    try {
      let avatarUrl = formData.avatar;
      
      if (avatarFile) {
        const uploadToast = toast.loading('Uploading avatar...');
        try {
          avatarUrl = await uploadImage(avatarFile, `testimonials/${Date.now()}`);
          toast.dismiss(uploadToast);
        } catch (error) {
          toast.dismiss(uploadToast);
          throw error;
        }
      }

      const testimonialData = {
        ...formData,
        avatar: avatarUrl,
      };

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialData);
        toast.success('Testimonial updated successfully');
      } else {
        await addTestimonial(testimonialData);
        toast.success('Testimonial added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar || '',
    });
    setAvatarPreview(testimonial.avatar || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        if (testimonial.avatar) {
          await deleteImage(testimonial.avatar);
        }
        await deleteTestimonial(testimonial.id);
        toast.success('Testimonial deleted successfully');
        loadTestimonials();
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      company: '',
      content: '',
      rating: 5,
      avatar: '',
    });
    setEditingTestimonial(null);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  // Pagination
  const filteredTestimonials = testimonials.filter(t =>
    t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTestimonials = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
          <p className="text-muted-foreground">Manage client testimonials</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10"
            />
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="w-full sm:w-auto">
            <Plus className="mr-2 w-4 h-4" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="p-6 space-y-4 bg-card rounded-xl border">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-muted rounded"></div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-lg mb-2">No testimonials found</p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Add your first testimonial to get started'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Add Testimonial
                  </Button>
                )}
              </div>
            ) : (
              currentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                >
                  <Card className="h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-1">
                      {/* Quote Icon */}
                      <Quote className="w-8 h-8 text-primary/20 mb-4" />

                      {/* Content */}
                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                        "{testimonial.content}"
                      </p>

                      {/* Bottom Section */}
                      <div className="mt-auto space-y-4">
                        {/* Rating */}
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.clientName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                              <span className="text-lg font-semibold text-primary">
                                {testimonial.clientName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{testimonial.clientName}</h4>
                            <p className="text-sm text-muted-foreground truncate">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(testimonial)}
                          className="p-2 shadow-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(testimonial)}
                          className="p-2 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTestimonials.length)} of {filteredTestimonials.length} testimonials
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
        <DialogContent className="max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? 'Update the details of the existing testimonial.'
                : 'Fill in the fields below to add a new client testimonial.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label>Client Name *</Label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label>Company</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tech Corp Inc."
              />
            </div>

            <div>
              <Label>Avatar</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: Square image, max 2MB
              </p>
              {(avatarPreview || formData.avatar) && (
                <div className="mt-3 flex items-center gap-3">
                  <img 
                    src={avatarPreview || formData.avatar} 
                    alt="Avatar preview" 
                    className="w-20 h-20 object-cover rounded-full border-2 border-border" 
                  />
                  {avatarPreview && (
                    <div className="text-sm">
                      <p className="font-medium text-green-600">New avatar selected</p>
                      <p className="text-xs text-muted-foreground">Will be uploaded on save</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label>Rating *</Label>
              <div className="flex gap-2 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        i < formData.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.rating} star{formData.rating !== 1 ? 's' : ''} selected
              </p>
            </div>

            <div>
              <Label>Testimonial Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={5}
                placeholder="Share your experience working with us..."
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.content.length}/500 characters (min 20)
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 w-4 h-4" />
                {editingTestimonial ? 'Update' : 'Create'}
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