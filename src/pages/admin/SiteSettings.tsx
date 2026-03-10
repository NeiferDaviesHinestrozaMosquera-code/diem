import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Palette, Globe, Mail, Phone, MapPin, Image,
  Save, Upload, Trash2, RefreshCw, Plus, GripVertical,
  ChevronLeft, ChevronRight, Eye, EyeOff, Pencil, Check, X,
  LayoutTemplate,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getSiteSettings, updateSiteSettings, uploadImage, subscribeToSiteSettings,
} from '@/services/index';
import type { SiteSettings } from '@/types';

// ── HeroSlide type (stored in heroImages as JSON-encoded strings or as a
//    parallel heroSlides field — here we keep it 100% backward-compatible
//    by serializing slides to the heroImages string array) ──────────────────────
interface HeroSlide {
  id:          string;
  title:       string;
  subtitle:    string;
  description: string;
  image:       string;
  gradient:    string;
}

const GRADIENT_OPTIONS = [
  { label: 'Ocean',    value: 'from-blue-600/90 to-purple-600/90'  },
  { label: 'Sunset',   value: 'from-purple-600/90 to-pink-600/90'  },
  { label: 'Forest',   value: 'from-emerald-600/90 to-teal-600/90' },
  { label: 'Fire',     value: 'from-orange-600/90 to-red-600/90'   },
  { label: 'Sky',      value: 'from-cyan-600/90 to-blue-600/90'    },
  { label: 'Dusk',     value: 'from-indigo-600/90 to-violet-600/90'},
];

const EMPTY_SLIDE = (): HeroSlide => ({
  id:          crypto.randomUUID(),
  title:       '',
  subtitle:    '',
  description: '',
  image:       '',
  gradient:    GRADIENT_OPTIONS[0].value,
});

/** Encode slides array into the heroImages string array (JSON per item) */
function slidesToHeroImages(slides: HeroSlide[]): string[] {
  return slides.map(s => JSON.stringify(s));
}

/** Decode heroImages array back into slides, with fallback for plain URLs */
function heroImagesToSlides(heroImages: string[]): HeroSlide[] {
  return heroImages.map((raw, idx) => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'id' in parsed) return parsed as HeroSlide;
    } catch { /* plain URL */ }
    // Legacy: plain image URL
    return {
      id:          `legacy-${idx}`,
      title:       '',
      subtitle:    '',
      description: '',
      image:       raw,
      gradient:    GRADIENT_OPTIONS[idx % GRADIENT_OPTIONS.length].value,
    };
  });
}

// ── Valores por defecto ────────────────────────────────────────────────────────
const defaultSettings: SiteSettings = {
  id:                     'site',
  siteName:               'Digital Emporium',
  tagline:                'Your Digital Success Partner',
  heroTitle:              'Transform Your Digital Vision',
  heroSubtitle:           'Into Reality',
  aboutText:              'We are a team of passionate digital experts dedicated to delivering exceptional results.',
  servicesText:           'Comprehensive digital solutions tailored to your business needs.',
  projectsText:           'Explore our portfolio of successful projects and case studies.',
  contactText:            'Get in touch with us to start your digital transformation journey.',
  logo:                   '',
  favicon:                '',
  primaryColor:           '#3b82f6',
  secondaryColor:         '#8b5cf6',
  accentColor:            '#ec4899',
  contactEmail:           'contact@digitalemporium.com',
  contactPhone:           '+1 (555) 123-4567',
  contactAddress:         '123 Innovation Street, Tech City, TC 12345',
  socialLinks: {
    facebook:  '',
    twitter:   '',
    instagram: '',
    linkedin:  '',
    github:    '',
    youtube:   '',
    whatsapp:  '',
  },
  contactInfo: {
    email:   'contact@digitalemporium.com',
    phone:   '+1 (555) 123-4567',
    address: '123 Innovation Street, Tech City, TC 12345',
  },
  metaDescription:        'Digital Emporium - Premium digital services for your business growth',
  metaKeywords:           'digital services, web development, mobile apps, AI solutions, e-commerce',
  heroImages:             [],
  servicesImages:         [],
  testimonialsBackground: '',
  footerText:             `© ${new Date().getFullYear()} Digital Emporium. All rights reserved.`,
  googleAnalyticsId:      '',
  customScripts:          '',
  carouselImages:         [],
};

/** Mezcla los datos de BD con los defaults para que nunca haya campos undefined */
function mergeWithDefaults(data: SiteSettings): SiteSettings {
  return {
    ...defaultSettings,
    ...data,
    socialLinks: { ...defaultSettings.socialLinks, ...data.socialLinks },
    contactInfo: { ...defaultSettings.contactInfo, ...data.contactInfo },
  };
}

export function SiteSettings() {
  const [settings, setSettings]       = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading]     = useState(true);
  const [isSaving, setIsSaving]       = useState(false);
  const [hasChanges, setHasChanges]   = useState(false);
  const [activeTab, setActiveTab]     = useState('general');
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  // ── Hero Slides CRUD state ───────────────────────────────────────────────────
  const [heroSlides, setHeroSlides]             = useState<HeroSlide[]>([]);
  const heroSlidesRef = useRef<HeroSlide[]>([]);
  const [editingSlideId, setEditingSlideId]     = useState<string | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx]   = useState(0);
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);

  // Referencia para saber si hay cambios sin guardar antes de aplicar update de Realtime
  const hasChangesRef = useRef(false);
  // Ref to prevent realtime from overwriting local state while a save is in-flight
  const isSavingRef = useRef(false);

  // ── Carga inicial + suscripción Realtime ─────────────────────────────────────
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const init = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          const merged = mergeWithDefaults(data);
          setSettings(merged);
          setLogoPreview(merged.logo || '');
          setFaviconPreview(merged.favicon || '');
          setHeroSlidesSync(heroImagesToSlides(merged.heroImages ?? []));
        }
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }

      // Suscripción en tiempo real — aplica cambios automáticamente siempre
      unsubscribe = subscribeToSiteSettings((updated) => {
        if (!updated) return;
        // Skip realtime update if a save is currently in-flight to avoid
        // overwriting local state with stale DB data
        if (isSavingRef.current) return;
        const merged = mergeWithDefaults(updated);
        setSettings(merged);
        setLogoPreview(merged.logo || '');
        setFaviconPreview(merged.favicon || '');
        setHeroSlidesSync(heroImagesToSlides(merged.heroImages ?? []));
        setHasChanges(false);
        hasChangesRef.current = false;
        toast.success('Settings synced from another session', { id: 'realtime-sync', duration: 2000 });
      });
    };

    init();
    return () => { unsubscribe?.(); };
  }, []);

  // ── Helpers de estado ─────────────────────────────────────────────────────────
  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    hasChangesRef.current = true;
  };

  // ── Al editar contactEmail/Phone/Address sincroniza también contactInfo ────────
  const updateContactField = (
    field: 'contactEmail' | 'contactPhone' | 'contactAddress',
    value: string,
  ) => {
    const infoKey = field === 'contactEmail'   ? 'email'
                  : field === 'contactPhone'   ? 'phone'
                  : 'address';

    setSettings(prev => ({
      ...prev,
      [field]: value,
      contactInfo: { ...prev.contactInfo, [infoKey]: value },
    }));
    setHasChanges(true);
    hasChangesRef.current = true;
  };

  const updateSocialLink = (key: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
    setHasChanges(true);
    hasChangesRef.current = true;
  };

  const handleColorChange = (
    colorType: 'primaryColor' | 'secondaryColor' | 'accentColor',
    value: string,
  ) => {
    if (value === '' || /^#[0-9A-Fa-f]{6}$/.test(value)) {
      updateField(colorType, value);
    }
  };

  // ── Imágenes ──────────────────────────────────────────────────────────────────
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'favicon' | 'heroImages' | 'servicesImages' | 'testimonialsBackground',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const toastId = toast.loading('Uploading image...');
    try {
      const imageUrl = await uploadImage(file, `settings/${field}`);

      if (field === 'heroImages' || field === 'servicesImages') {
        setSettings(prev => ({ ...prev, [field]: [...(prev[field] as string[]), imageUrl] }));
      } else {
        setSettings(prev => ({ ...prev, [field]: imageUrl }));
        if (field === 'logo')    setLogoPreview(imageUrl);
        if (field === 'favicon') setFaviconPreview(imageUrl);
      }

      setHasChanges(true);
      hasChangesRef.current = true;
      toast.success('Image uploaded successfully', { id: toastId });
    } catch {
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const removeImage = (field: keyof SiteSettings, index?: number) => {
    if (field === 'heroImages' || field === 'servicesImages') {
      setSettings(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: '' }));
      if (field === 'logo')    setLogoPreview('');
      if (field === 'favicon') setFaviconPreview('');
    }
    setHasChanges(true);
    hasChangesRef.current = true;
  };


  // ── Hero Slides CRUD helpers ──────────────────────────────────────────────────
  const markChanged = () => { setHasChanges(true); hasChangesRef.current = true; };

  // Wrapper that keeps heroSlidesRef in sync with state
  const setHeroSlidesSync = (updater: HeroSlide[] | ((prev: HeroSlide[]) => HeroSlide[])) => {
    setHeroSlides(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      heroSlidesRef.current = next;
      return next;
    });
  };

  const addSlide = () => {
    const slide = EMPTY_SLIDE();
    setHeroSlidesSync(prev => [...prev, slide]);
    setEditingSlideId(slide.id);
    setPreviewSlideIdx(heroSlides.length);
    markChanged();
  };

  const updateSlide = (id: string, patch: Partial<HeroSlide>) => {
    setHeroSlidesSync(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    markChanged();
  };

  const deleteSlide = (id: string) => {
    setHeroSlidesSync(prev => {
      const next = prev.filter(s => s.id !== id);
      setPreviewSlideIdx(i => Math.min(i, Math.max(0, next.length - 1)));
      return next;
    });
    if (editingSlideId === id) setEditingSlideId(null);
    markChanged();
  };

  const duplicateSlide = (id: string) => {
    const src = heroSlides.find(s => s.id === id);
    if (!src) return;
    const copy = { ...src, id: crypto.randomUUID(), title: src.title + ' (copy)' };
    setHeroSlidesSync(prev => [...prev, copy]);
    markChanged();
  };

  const handleSlideImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slideId: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlideId(slideId);
    const toastId = toast.loading('Uploading slide image...');
    try {
      const url = await uploadImage(file, 'settings/heroImages');
      updateSlide(slideId, { image: url });
      toast.success('Image uploaded', { id: toastId });
    } catch {
      toast.error('Upload failed', { id: toastId });
    } finally {
      setUploadingSlideId(null);
    }
  };

  // ── Guardar ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    isSavingRef.current = true;
    try {
      // Asegura que contactInfo siempre está en sync al guardar
      // Encode heroSlides back into heroImages
      const toSave: SiteSettings = {
        ...settings,
        heroImages: slidesToHeroImages(heroSlidesRef.current),
        contactInfo: {
          email:   settings.contactEmail,
          phone:   settings.contactPhone,
          address: settings.contactAddress,
        },
      };
      await updateSiteSettings(toSave);
      setHasChanges(false);
      hasChangesRef.current = false;
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  // ── Recargar desde BD (descarta cambios locales) ─────────────────────────────
  const handleReload = async () => {
    setIsLoading(true);
    try {
      const data = await getSiteSettings();
      if (data) {
        const merged = mergeWithDefaults(data);
        setSettings(merged);
        setLogoPreview(merged.logo || '');
        setFaviconPreview(merged.favicon || '');
        setHasChanges(false);
        hasChangesRef.current = false;
        toast.success('Settings reloaded from database');
      }
    } catch {
      toast.error('Failed to reload settings');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading spinner ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Customize your website appearance and configuration
            {hasChanges && (
              <span className="ml-2 text-amber-500 font-medium">· Unsaved changes</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReload}
            disabled={isSaving}
            title="Discard local changes and reload from database"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* ── General ────────────────────────────────────────────────────────── */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    placeholder="Digital Emporium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    placeholder="Your Digital Success Partner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => updateField('footerText', e.target.value)}
                  placeholder={`© ${new Date().getFullYear()} Digital Emporium. All rights reserved.`}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutText">About Section Text</Label>
                <Textarea
                  id="aboutText"
                  value={settings.aboutText}
                  onChange={(e) => updateField('aboutText', e.target.value)}
                  placeholder="We are a team of passionate digital experts..."
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servicesText">Services Intro Text</Label>
                  <Textarea
                    id="servicesText"
                    value={settings.servicesText}
                    onChange={(e) => updateField('servicesText', e.target.value)}
                    placeholder="Comprehensive digital solutions..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectsText">Projects Intro Text</Label>
                  <Textarea
                    id="projectsText"
                    value={settings.projectsText}
                    onChange={(e) => updateField('projectsText', e.target.value)}
                    placeholder="Explore our portfolio..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════
            HERO TAB — Full CRUD
        ═══════════════════════════════════════════════════ */}
        <TabsContent value="hero" className="space-y-6">

          {/* ── Global hero text ─────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5" />
                Default Hero Text
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  (used as fallback when no slides are defined)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                  placeholder="Transform Your Digital Vision"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                  placeholder="Into Reality"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Slides CRUD ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Hero Slides</h3>
              <p className="text-sm text-muted-foreground">
                {heroSlides.length === 0
                  ? 'No slides yet — add your first one below.'
                  : `${heroSlides.length} slide${heroSlides.length > 1 ? 's' : ''} · drag to reorder`}
              </p>
            </div>
            <Button onClick={addSlide} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Slide
            </Button>
          </div>

          {/* ── Live preview strip ────────────────────────────────────────────── */}
          {heroSlides.length > 0 && (
            <Card className="overflow-hidden">
              <div className="relative h-48 md:h-64 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewSlideIdx}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    {heroSlides[previewSlideIdx]?.image ? (
                      <img
                        src={heroSlides[previewSlideIdx].image}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Image className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[previewSlideIdx]?.gradient ?? 'from-blue-600/90 to-purple-600/90'}`} />
                  </motion.div>
                </AnimatePresence>

                {/* Preview text overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center px-8">
                  {heroSlides[previewSlideIdx]?.subtitle && (
                    <span className="inline-block self-start px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs mb-2">
                      {heroSlides[previewSlideIdx].subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                    {heroSlides[previewSlideIdx]?.title || <span className="opacity-40">No title yet</span>}
                  </h2>
                  {heroSlides[previewSlideIdx]?.description && (
                    <p className="text-white/80 text-sm mt-1 max-w-sm line-clamp-2">
                      {heroSlides[previewSlideIdx].description}
                    </p>
                  )}
                </div>

                {/* Preview navigation */}
                {heroSlides.length > 1 && (
                  <>
                    <button
                      onClick={() => setPreviewSlideIdx(i => (i - 1 + heroSlides.length) % heroSlides.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewSlideIdx(i => (i + 1) % heroSlides.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Slide counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewSlideIdx(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === previewSlideIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <Badge className="absolute top-3 left-3 z-20 bg-black/50 border-0 text-white text-xs">
                  Live Preview
                </Badge>
              </div>
            </Card>
          )}

          {/* ── Reorderable slide list ────────────────────────────────────────── */}
          {heroSlides.length > 0 && (
            <Reorder.Group
              axis="y"
              values={heroSlides}
              onReorder={(next) => { setHeroSlidesSync(next); markChanged(); }}
              className="space-y-3"
            >
              {heroSlides.map((slide, index) => {
                const isEditing  = editingSlideId === slide.id;
                const isUploading = uploadingSlideId === slide.id;

                return (
                  <Reorder.Item key={slide.id} value={slide}>
                    <motion.div
                      layout
                      className={`rounded-2xl border bg-card transition-shadow ${
                        isEditing ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {/* ── Slide header ── */}
                      <div className="flex items-center gap-3 p-4">
                        {/* Drag handle */}
                        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Thumbnail */}
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                          {slide.image ? (
                            <img src={slide.image} alt="thumb" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          )}
                          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-60`} />
                        </div>

                        {/* Title & badge */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {slide.title || <span className="text-muted-foreground italic">Untitled slide</span>}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
                        </div>

                        <Badge variant="outline" className="text-xs shrink-0">
                          #{index + 1}
                        </Badge>

                        {/* Actions */}
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Preview this slide"
                            onClick={() => setPreviewSlideIdx(index)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title={isEditing ? 'Collapse' : 'Edit'}
                            onClick={() => setEditingSlideId(isEditing ? null : slide.id)}
                          >
                            {isEditing ? <EyeOff className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete slide"
                            onClick={() => deleteSlide(slide.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* ── Inline edit form ── */}
                      <AnimatePresence>
                        {isEditing && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-5 space-y-4 border-t border-border pt-4">
                              
                              {/* Image upload */}
                              <div className="space-y-2">
                                <Label>Background Image</Label>
                                <div className="flex gap-3 items-center">
                                  <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                                    {slide.image ? (
                                      <>
                                        <img src={slide.image} alt="bg" className="w-full h-full object-cover" />
                                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-50`} />
                                        <button
                                          onClick={() => updateSlide(slide.id, { image: '' })}
                                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Image className="w-6 h-6 text-muted-foreground/40" />
                                      </div>
                                    )}
                                  </div>
                                  <label className="flex-1">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                      {isUploading ? (
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                                        />
                                      ) : (
                                        <Upload className="w-4 h-4" />
                                      )}
                                      {isUploading ? 'Uploading…' : 'Choose image'}
                                    </div>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleSlideImageUpload(e, slide.id)}
                                    />
                                  </label>
                                </div>
                                {/* Or paste URL */}
                                <Input
                                  placeholder="…or paste an image URL"
                                  value={slide.image}
                                  onChange={(e) => { updateSlide(slide.id, { image: e.target.value }); setPreviewSlideIdx(index); }}
                                  className="text-xs"
                                />
                              </div>

                              {/* Gradient picker */}
                              <div className="space-y-2">
                                <Label>Color Gradient</Label>
                                <div className="flex flex-wrap gap-2">
                                  {GRADIENT_OPTIONS.map(g => (
                                    <button
                                      key={g.value}
                                      title={g.label}
                                      onClick={() => { updateSlide(slide.id, { gradient: g.value }); setPreviewSlideIdx(index); }}
                                      className={`relative w-10 h-10 rounded-xl bg-gradient-to-r ${g.value} transition-all ${
                                        slide.gradient === g.value
                                          ? 'ring-2 ring-offset-2 ring-primary scale-110'
                                          : 'hover:scale-105'
                                      }`}
                                    >
                                      {slide.gradient === g.value && (
                                        <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Title / Subtitle / Description */}
                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label>Title</Label>
                                  <Input
                                    placeholder="Transform Your Digital Presence"
                                    value={slide.title}
                                    onChange={(e) => { updateSlide(slide.id, { title: e.target.value }); setPreviewSlideIdx(index); }}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label>Subtitle <span className="text-muted-foreground font-normal">(badge text)</span></Label>
                                  <Input
                                    placeholder="Innovative solutions for modern businesses"
                                    value={slide.subtitle}
                                    onChange={(e) => { updateSlide(slide.id, { subtitle: e.target.value }); setPreviewSlideIdx(index); }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label>Description</Label>
                                <Textarea
                                  placeholder="A short paragraph displayed below the title…"
                                  value={slide.description}
                                  rows={2}
                                  onChange={(e) => { updateSlide(slide.id, { description: e.target.value }); setPreviewSlideIdx(index); }}
                                />
                              </div>

                              {/* Actions row */}
                              <div className="flex gap-2 pt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => duplicateSlide(slide.id)}
                                  className="gap-1.5"
                                >
                                  Duplicate
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                                  onClick={() => deleteSlide(slide.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete slide
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingSlideId(null)}
                                  className="gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Done
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          )}

          {/* ── Empty state ───────────────────────────────────────────────────── */}
          {heroSlides.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-border text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Image className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h4 className="font-semibold mb-1">No slides yet</h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Add your first hero slide. Each slide has its own image, gradient, title and description.
              </p>
              <Button onClick={addSlide} className="gap-2">
                <Plus className="w-4 h-4" />
                Add first slide
              </Button>
            </motion.div>
          )}

          {/* ── Hint ─────────────────────────────────────────────────────────── */}
          {heroSlides.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Drag slides to reorder · Click the eye icon to preview · Remember to <strong>Save Changes</strong> when done.
            </p>
          )}
        </TabsContent>

        {/* ── Branding ───────────────────────────────────────────────────────── */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Logo & Favicon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo */}
                <div className="space-y-2">
                  <Label>Site Logo</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative group">
                        <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded-lg border" />
                        <button
                          onClick={() => removeImage('logo')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        <Image className="w-8 h-8" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    {faviconPreview ? (
                      <div className="relative group">
                        <img src={faviconPreview} alt="Favicon preview" className="w-10 h-10 object-contain rounded-lg border" />
                        <button
                          onClick={() => removeImage('favicon')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        <Image className="w-5 h-5" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'favicon')}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(
                  [
                    { key: 'primaryColor',   label: 'Primary Color',   placeholder: '#3b82f6' },
                    { key: 'secondaryColor', label: 'Secondary Color', placeholder: '#8b5cf6' },
                    { key: 'accentColor',    label: 'Accent Color',    placeholder: '#ec4899' },
                  ] as const
                ).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        placeholder={placeholder}
                      />
                    </div>
                  </div>
                ))}

                {/* Preview */}
                <div className="mt-4 p-4 rounded-lg border bg-muted/20">
                  <p className="text-sm font-medium mb-3">Color Preview</p>
                  <div className="flex gap-4">
                    {(
                      [
                        { key: 'primaryColor',   label: 'Primary'   },
                        { key: 'secondaryColor', label: 'Secondary' },
                        { key: 'accentColor',    label: 'Accent'    },
                      ] as const
                    ).map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                          style={{ backgroundColor: settings[key] }}
                        />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Contact ────────────────────────────────────────────────────────── */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateContactField('contactEmail', e.target.value)}
                    placeholder="contact@digitalemporium.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => updateContactField('contactPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </Label>
                <Textarea
                  id="contactAddress"
                  value={settings.contactAddress}
                  onChange={(e) => updateContactField('contactAddress', e.target.value)}
                  placeholder="123 Innovation Street, Tech City, TC 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {(
                  [
                    { key: 'facebook',  placeholder: 'Facebook URL',  label: 'Facebook'  },
                    { key: 'twitter',   placeholder: 'Twitter URL',   label: 'Twitter'   },
                    { key: 'instagram', placeholder: 'Instagram URL', label: 'Instagram' },
                    { key: 'linkedin',  placeholder: 'LinkedIn URL',  label: 'LinkedIn'  },
                    { key: 'github',    placeholder: 'GitHub URL',    label: 'GitHub'    },
                    { key: 'youtube',   placeholder: 'YouTube URL',   label: 'YouTube'   },
                    { key: 'whatsapp',  placeholder: 'WhatsApp number (e.g. 15551234567)', label: 'WhatsApp' },
                  ] as const
                ).map(({ key, placeholder, label }) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{label}</Label>
                    <Input
                      placeholder={placeholder}
                      value={settings.socialLinks[key] ?? ''}
                      onChange={(e) => updateSocialLink(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SEO ────────────────────────────────────────────────────────────── */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  placeholder="Brief description of your website for search engines"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  {settings.metaDescription.length} / 160 characters recommended
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) => updateField('metaKeywords', e.target.value)}
                  placeholder="digital services, web development, mobile apps"
                />
                <p className="text-sm text-muted-foreground">Separate keywords with commas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Media ──────────────────────────────────────────────────────────── */}
        <TabsContent value="media" className="space-y-6">
          {/* Hero Images */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {settings.heroImages.map((image, index) => (
                  <div key={index} className="relative group aspect-video">
                    <img src={image} alt={`Hero ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage('heroImages', index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImages')} className="hidden" />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Services Images */}
          <Card>
            <CardHeader>
              <CardTitle>Services Section Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {settings.servicesImages.map((image, index) => (
                  <div key={index} className="relative group aspect-video">
                    <img src={image} alt={`Service ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage('servicesImages', index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'servicesImages')} className="hidden" />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Background */}
          <Card>
            <CardHeader>
              <CardTitle>Testimonials Background</CardTitle>
            </CardHeader>
            <CardContent>
              {settings.testimonialsBackground ? (
                <div className="relative group aspect-video max-w-md">
                  <img src={settings.testimonialsBackground} alt="Testimonials background" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage('testimonialsBackground')}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="aspect-video max-w-md border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Background</span>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'testimonialsBackground')} className="hidden" />
                </label>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Advanced ───────────────────────────────────────────────────────── */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">Enter your Google Analytics measurement ID</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customScripts">Custom Scripts</Label>
                <Textarea
                  id="customScripts"
                  value={settings.customScripts}
                  onChange={(e) => updateField('customScripts', e.target.value)}
                  placeholder="Paste your custom JavaScript or tracking codes here"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  These scripts will be added to the &lt;head&gt; section of your website
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}