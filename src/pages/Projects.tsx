import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, ChevronLeft, ChevronRight,
  Calendar, User, Folder, Code2, Loader2, AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { getProjects, subscribeToProjects } from '@/services/index';
import type { Project } from '@/types';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // Carga inicial
    getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los proyectos.');
        setLoading(false);
      });

    // Suscripción en tiempo real
    const unsubscribe = subscribeToProjects((updated) => {
      setProjects(updated);
    });

    return () => unsubscribe();
  }, []);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length
      );
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
              {t('projectsTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            {t('projectsSubtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p>{t('loading', 'Cargando proyectos...')}</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-destructive">
              <AlertCircle className="w-10 h-10" />
              <p>{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <Folder className="w-10 h-10" />
              <p>{t('noProjects', 'No hay proyectos disponibles aún.')}</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => openProject(project)}
                  className="relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {project.images?.[0] ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Folder className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-primary/90 text-primary-foreground text-xs font-medium">
                      {project.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <motion.span
                          key={tech.name}
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                        >
                          {tech.icon && <span>{tech.icon}</span>}
                          {tech.name}
                        </motion.span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Client */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{project.client}</span>
                      </div>
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="flex items-center text-primary font-medium"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </motion.span>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
              </DialogHeader>

              {/* Image Carousel */}
              <div className="relative mt-4 mb-6">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                  {selectedProject.images?.[currentImageIndex] ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={selectedProject.images[currentImageIndex]}
                        alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Folder className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Navigation */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image Indicators */}
                {selectedProject.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {selectedProject.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 w-2'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <p className="text-muted-foreground">{selectedProject.longDescription}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t('Client')}</div>
                      <div className="font-medium">{selectedProject.client}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Folder className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t('Category')}</div>
                      <div className="font-medium">{selectedProject.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t('Project Date')}</div>
                      <div className="font-medium">
                        {new Date(selectedProject.completionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {selectedProject.projectUrl && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <ExternalLink className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">URL</div>
                        <a
                          href={selectedProject.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {t('visitProject')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technologies */}
                {selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      {t('technologies')}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech) => (
                        <motion.div
                          key={tech.name}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20"
                        >
                          {tech.icon && <span className="text-xl">{tech.icon}</span>}
                          <span className="font-medium text-sm">{tech.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}