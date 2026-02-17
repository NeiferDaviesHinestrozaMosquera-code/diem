import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X, Image as ImageIcon,
  Search, ChevronLeft, ChevronRight, Link2, FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  getProjects, addProject, updateProject, deleteProject,
  uploadImage, deleteImage
} from '@/services/supabase';
import type { Project } from '@/types';


const techCategories: Record<string, { label: string; techs: string[] }> = {
  frontend: {
    label: '🖥️ Frontend',
    techs: [
      'react', 'nextjs', 'vuejs', 'nuxtjs', 'angular', 'svelte', 'sveltekit',
      'astro', 'remix', 'gatsby', 'typescript', 'javascript', 'html', 'css',
      'tailwind', 'sass', 'styled-components', 'shadcn', 'radix-ui',
      'framer-motion', 'redux', 'zustand', 'vite', 'webpack', 'storybook',
    ],
  },
  backend: {
    label: '⚙️ Backend',
    techs: [
      'nodejs', 'express', 'nestjs', 'fastapi', 'django', 'flask',
      'laravel', 'symfony', 'spring', 'ruby-on-rails', 'go', 'rust',
      'java', 'kotlin', 'csharp', 'dotnet', 'php', 'elixir', 'haskell',
      'graphql', 'rest-api', 'grpc', 'websockets', 'trpc',
    ],
  },
  databases: {
    label: '🗄️ Databases',
    techs: [
      'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'supabase',
      'firebase', 'dynamodb', 'cassandra', 'elasticsearch', 'neo4j',
      'prisma', 'drizzle', 'planetscale', 'neon', 'turso',
    ],
  },
  cloud: {
    label: '☁️ Cloud & DevOps',
    techs: [
      'aws', 'gcp', 'azure', 'vercel', 'netlify', 'heroku', 'railway',
      'docker', 'kubernetes', 'terraform', 'github-actions', 'gitlab-ci',
      'circleci', 'nginx', 'linux', 'cloudflare',
    ],
  },
  mobile: {
    label: '📱 Mobile',
    techs: [
      'react-native', 'flutter', 'swift', 'swiftui', 'kotlin-android',
      'expo', 'ionic', 'capacitor', 'xamarin',
    ],
  },
  testing: {
    label: '🧪 Testing',
    techs: [
      'jest', 'vitest', 'cypress', 'playwright', 'testing-library',
      'storybook', 'k6', 'selenium',
    ],
  },
  design: {
    label: '🎨 Design & Collaboration',
    techs: [
      'figma', 'adobe-xd', 'sketch', 'photoshop', 'illustrator',
      'blender', 'framer', 'miro', 'notion', 'jira', 'linear',
    ],
  },
  ai: {
    label: '🤖 AI & Data',
    techs: [
      'python', 'openai', 'langchain', 'huggingface', 'tensorflow',
      'pytorch', 'pandas', 'numpy', 'scikit-learn', 'jupyter',
      'spark', 'airflow', 'dbt', 'snowflake',
    ],
  },
  tools: {
    label: '🔧 Tools & Others',
    techs: [
      'git', 'github', 'gitlab', 'bitbucket', 'stripe', 'twilio',
      'sendgrid', 'pusher', 'socket-io', 'oauth', 'jwt',
      'webrtc', 'pwa', 'electron', 'tauri',
    ],
  },
};

const technologies = Object.values(techCategories).flatMap(c => c.techs);

const techIcons: Record<string, string> = {
  // ─── Frontend ────────────────────────────────────────────────────────────
  react:             '⚛️',
  nextjs:            '▲',
  vuejs:             '💚',
  nuxtjs:            '🟩',
  angular:           '🔴',
  svelte:            '🔶',
  sveltekit:         '🔷',
  astro:             '🚀',
  remix:             '💿',
  gatsby:            '🟣',
  typescript:        '📘',
  javascript:        '💛',
  html:              '🌐',
  css:               '🎨',
  tailwind:          '🌊',
  sass:              '💅',
  'styled-components':'💄',
  shadcn:            '🫧',
  'radix-ui':        '⚪',
  'framer-motion':   '🎬',
  redux:             '🔄',
  zustand:           '🐻',
  vite:              '⚡',
  webpack:           '📦',
  storybook:         '📖',
  // ─── Backend ─────────────────────────────────────────────────────────────
  nodejs:            '🟢',
  express:           '🚂',
  nestjs:            '🐱',
  fastapi:           '🏎️',
  django:            '🎸',
  flask:             '🧪',
  laravel:           '🔴',
  symfony:           '⬛',
  spring:            '☕',
  'ruby-on-rails':   '💎',
  go:                '🐹',
  rust:              '🦀',
  java:              '☕',
  kotlin:            '🟠',
  csharp:            '🔷',
  dotnet:            '🔵',
  php:               '🐘',
  elixir:            '💜',
  haskell:           '🟣',
  graphql:           '◈',
  'rest-api':        '🔗',
  grpc:              '🔌',
  websockets:        '🔁',
  trpc:              '🛤️',
  // ─── Databases ───────────────────────────────────────────────────────────
  mongodb:           '🍃',
  postgresql:        '🐘',
  mysql:             '🐬',
  sqlite:            '🪶',
  redis:             '🟥',
  supabase:          '⚡',
  firebase:          '🔥',
  dynamodb:          '🔶',
  cassandra:         '👁️',
  elasticsearch:     '🔍',
  neo4j:             '🕸️',
  prisma:            '📐',
  drizzle:           '💧',
  planetscale:       '🪐',
  neon:              '✨',
  turso:             '🦅',
  // ─── Cloud & DevOps ──────────────────────────────────────────────────────
  aws:               '☁️',
  gcp:               '🌥️',
  azure:             '🔵',
  vercel:            '△',
  netlify:           '🌐',
  heroku:            '💜',
  railway:           '🚆',
  docker:            '🐳',
  kubernetes:        '⚙️',
  terraform:         '🏗️',
  'github-actions':  '🤖',
  'gitlab-ci':       '🔶',
  circleci:          '⭕',
  nginx:             '🌿',
  linux:             '🐧',
  cloudflare:        '🟠',
  // ─── Mobile ──────────────────────────────────────────────────────────────
  'react-native':    '📱',
  flutter:           '💙',
  swift:             '🦅',
  swiftui:           '🍎',
  'kotlin-android':  '🤖',
  expo:              '📲',
  ionic:             '⚡',
  capacitor:         '🔋',
  xamarin:           '🟣',
  // ─── Testing ─────────────────────────────────────────────────────────────
  jest:              '🃏',
  vitest:            '⚡',
  cypress:           '🌲',
  playwright:        '🎭',
  'testing-library': '🧪',
  k6:                '📊',
  selenium:          '🤖',
  // ─── Design & Collaboration ───────────────────────────────────────────────
  figma:             '🎨',
  'adobe-xd':        '🟪',
  sketch:            '💎',
  photoshop:         '🖼️',
  illustrator:       '🖊️',
  blender:           '🍊',
  framer:            '🖌️',
  miro:              '🟡',
  notion:            '⬛',
  jira:              '🔵',
  linear:            '🟣',
  // ─── AI & Data ───────────────────────────────────────────────────────────
  python:            '🐍',
  openai:            '🤖',
  langchain:         '🔗',
  huggingface:       '🤗',
  tensorflow:        '🔬',
  pytorch:           '🔥',
  pandas:            '🐼',
  numpy:             '🔢',
  'scikit-learn':    '🧠',
  jupyter:           '📓',
  spark:             '✨',
  airflow:           '🌬️',
  dbt:               '🏗️',
  snowflake:         '❄️',
  // ─── Tools & Others ──────────────────────────────────────────────────────
  git:               '🌿',
  github:            '🐙',
  gitlab:            '🦊',
  bitbucket:         '🪣',
  stripe:            '💳',
  twilio:            '🟥',
  sendgrid:          '📧',
  pusher:            '📡',
  'socket-io':       '🔁',
  oauth:             '🔐',
  jwt:               '🪙',
  webrtc:            '📹',
  pwa:               '📲',
  electron:          '⚡',
  tauri:             '🦀',
};

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    client: '',
    category: '',
    technologies: [] as string[],
    images: [] as string[],
    projectUrl: '',
    completionDate: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validar cada archivo
    const validFiles: File[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        continue;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Limitar a 5 imágenes totales
    const totalImages = formData.images.length + imagePreviews.length + validFiles.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed per project');
      return;
    }

    setImageFiles([...imageFiles, ...validFiles]);

    // Crear previews
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client || !formData.category || !formData.completionDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.technologies.length === 0) {
      toast.error('Please select at least one technology');
      return;
    }

    try {
      let uploadedImages = [...formData.images];
      
      if (imageFiles.length > 0) {
        const uploadToast = toast.loading(`Uploading ${imageFiles.length} image(s)...`);
        try {
          const uploadPromises = imageFiles.map((file, index) =>
            uploadImage(file, `projects/${Date.now()}_${index}`)
          );
          const newImages = await Promise.all(uploadPromises);
          uploadedImages = [...uploadedImages, ...newImages];
          toast.dismiss(uploadToast);
        } catch (error) {
          toast.dismiss(uploadToast);
          throw error;
        }
      }

      const projectData = {
        ...formData,
        images: uploadedImages.slice(0, 5), // Max 5 images
        technologies: formData.technologies.map(name => ({ name, icon: techIcons[name] || '🛠️' })),
      };

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await addProject(projectData);
        toast.success('Project added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      client: project.client,
      category: project.category,
      technologies: project.technologies.map(t => t.name),
      images: project.images,
      projectUrl: project.projectUrl || '',
      completionDate: project.completionDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Delete all images
        for (const imageUrl of project.images) {
          await deleteImage(imageUrl);
        }
        await deleteProject(project.id);
        toast.success('Project deleted successfully');
        loadProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      client: '',
      category: '',
      technologies: [],
      images: [],
      projectUrl: '',
      completionDate: '',
    });
    setEditingProject(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const toggleTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removePreviewImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Pagination
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10"
            />
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="w-full sm:w-auto">
            <Plus className="mr-2 w-4 h-4" />
            Add Project
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
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-lg mb-2">No projects found</p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Add your first project to get started'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Add Project
                  </Button>
                )}
              </div>
            ) : (
              currentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => handleEdit(project)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                      {project.category}
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                        className="p-2 shadow-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => { e.stopPropagation(); handleDelete(project); }}
                        className="p-2 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{project.client}</p>
                    <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2 py-1 rounded bg-muted text-xs"
                        >
                          {techIcons[tech.name] || '🛠️'} {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 rounded bg-muted text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
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
                  placeholder="e.g., E-Commerce Platform"
                />
              </div>
              <div>
                <Label>Client *</Label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  required
                  placeholder="e.g., Tech Corp"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="E-Commerce, AI Solutions, etc."
                  required
                />
              </div>
              <div>
                <Label>Completion Date *</Label>
                <Input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Project URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="pl-10"
                  type="url"
                />
              </div>
            </div>

            <div>
              <Label>Technologies *</Label>
              <div className="max-h-72 overflow-y-auto border rounded-lg p-3 mt-2 space-y-4">
                {Object.entries(techCategories).map(([key, category]) => (
                  <div key={key}>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      {category.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.techs.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleTechnology(tech)}
                          className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                            formData.technologies.includes(tech)
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-medium'
                              : 'border-border hover:border-primary/50 hover:bg-muted'
                          }`}
                        >
                          <span className="mr-1">{techIcons[tech] || '🛠️'}</span>
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.technologies.length} selected
                {formData.technologies.length > 0 && (
                  <span className="ml-2">
                    → {formData.technologies.map(t => techIcons[t] || '🛠️').join(' ')}
                  </span>
                )}
              </p>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={2}
                placeholder="Brief project overview"
              />
            </div>

            <div>
              <Label>Full Description *</Label>
              <Textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                required
                rows={4}
                placeholder="Detailed project description, challenges, and solutions"
              />
            </div>

            <div>
              <Label>Images (Max 5)</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFilesChange}
                  disabled={formData.images.length + imagePreviews.length >= 5}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.images.length + imagePreviews.length}/5 images • Max 5MB each
                </p>
                
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Existing Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Image ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-border" 
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">New Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-green-500" 
                          />
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 w-4 h-4" />
                {editingProject ? 'Update Project' : 'Create Project'}
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