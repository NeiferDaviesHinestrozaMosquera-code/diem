import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Globe, Mail, Phone, MapPin, Image,
  Save, Upload, Trash2, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  getSiteSettings, updateSiteSettings, uploadImage, subscribeToSiteSettings,
} from '@/services/supabase';
import type { SiteSettings } from '@/types';

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

  // Referencia para saber si hay cambios sin guardar antes de aplicar update de Realtime
  const hasChangesRef = useRef(false);

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
        }
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }

      // Suscripción en tiempo real — aplica cambios automáticamente siempre
      unsubscribe = subscribeToSiteSettings((updated) => {
        if (!updated) return;
        const merged = mergeWithDefaults(updated);
        setSettings(merged);
        setLogoPreview(merged.logo || '');
        setFaviconPreview(merged.favicon || '');
        setHasChanges(false);
        hasChangesRef.current = false;
        toast.success('Settings synced', { id: 'realtime-sync', duration: 2000 });
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

  // ── Guardar ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Asegura que contactInfo siempre está en sync al guardar
      const toSave: SiteSettings = {
        ...settings,
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
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="contactText">Contact Section Text</Label>
                <Textarea
                  id="contactText"
                  value={settings.contactText}
                  onChange={(e) => updateField('contactText', e.target.value)}
                  placeholder="Get in touch with us..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
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