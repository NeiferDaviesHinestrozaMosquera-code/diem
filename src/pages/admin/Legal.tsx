// // pages/admin/LegalPagesAdmin.tsx
// import { useEffect, useState, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FileText,
//   Shield,
//   Edit3,
//   Save,
//   RotateCcw,
//   Eye,
//   EyeOff,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   ChevronRight,
//   Info,
//   Hash,
//   Globe,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { toast } from 'sonner';
// import {
//   getLegalPages,
//   updateLegalPage,
//   subscribeToLegalPages,
// } from '@/services/legalPages';
// import type { LegalPage } from '@/types';

// // ── helpers ──────────────────────────────────────────────────
// type PageId = 'privacy-policy' | 'terms-of-service';

// const PAGE_META: Record<PageId, { label: string; icon: typeof Shield; color: string; preview: string }> = {
//   'privacy-policy': {
//     label: 'Política de Privacidad',
//     icon: Shield,
//     color: 'bg-[#5D4E8C]',
//     preview: '/privacy-policy',
//   },
//   'terms-of-service': {
//     label: 'Términos de Servicio',
//     icon: FileText,
//     color: 'bg-[#3D6060]',
//     preview: '/terms-of-service',
//   },
// };

// // ── Save status indicator ──────────────────────────────────────
// type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// function StatusBadge({ status }: { status: SaveStatus }) {
//   const map: Record<SaveStatus, { label: string; color: string; Icon: typeof CheckCircle }> = {
//     idle:   { label: 'Sin cambios',  color: 'text-muted-foreground', Icon: Info          },
//     saving: { label: 'Guardando…',   color: 'text-blue-500',         Icon: RotateCcw     },
//     saved:  { label: 'Guardado',     color: 'text-green-500',        Icon: CheckCircle   },
//     error:  { label: 'Error al guardar', color: 'text-red-500',      Icon: AlertCircle   },
//   };
//   const { label, color, Icon } = map[status];
//   return (
//     <span className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
//       <Icon className={`h-4 w-4 ${status === 'saving' ? 'animate-spin' : ''}`} />
//       {label}
//     </span>
//   );
// }

// // ── Field component ───────────────────────────────────────────
// function Field({
//   label,
//   hint,
//   children,
// }: {
//   label: string;
//   hint?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-1.5">
//       <Label className="font-medium">{label}</Label>
//       {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
//       {children}
//     </div>
//   );
// }

// // ── Editor panel for a single page ───────────────────────────
// function PageEditor({
//   page,
//   onSaved,
// }: {
//   page: LegalPage;
//   onSaved: () => void;
// }) {
//   const meta = PAGE_META[page.id as PageId];
//   const Icon = meta?.icon ?? FileText;

//   const [form, setForm] = useState({
//     title:           page.title,
//     slug:            page.slug,
//     version:         page.version,
//     language:        page.language,
//     isActive:        page.isActive,
//     metaDescription: page.metaDescription,
//     content:         page.content,
//   });
//   const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
//   const [dirty, setDirty] = useState(false);
//   const [preview, setPreview] = useState(false);

//   const set = (key: keyof typeof form, value: string | boolean) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//     setDirty(true);
//     setSaveStatus('idle');
//   };

//   const handleSave = async () => {
//     setSaveStatus('saving');
//     try {
//       await updateLegalPage(page.id, {
//         title:           form.title,
//         slug:            form.slug,
//         version:         form.version,
//         language:        form.language as 'es' | 'en',
//         isActive:        form.isActive,
//         metaDescription: form.metaDescription,
//         content:         form.content,
//       });
//       setSaveStatus('saved');
//       setDirty(false);
//       toast.success(`"${form.title}" guardado correctamente`);
//       onSaved();
//     } catch {
//       setSaveStatus('error');
//       toast.error('Error al guardar. Inténtalo de nuevo.');
//     }
//   };

//   const handleReset = () => {
//     setForm({
//       title:           page.title,
//       slug:            page.slug,
//       version:         page.version,
//       language:        page.language,
//       isActive:        page.isActive,
//       metaDescription: page.metaDescription,
//       content:         page.content,
//     });
//     setDirty(false);
//     setSaveStatus('idle');
//   };

//   return (
//     <Card className="overflow-hidden">
//       {/* Header */}
//       <CardHeader className="pb-4 border-b border-border">
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <CardTitle className="flex items-center gap-3">
//             <div className={`w-10 h-10 ${meta?.color ?? 'bg-[#5D4E8C]'} rounded-xl flex items-center justify-center shrink-0`}>
//               <Icon className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <span className="text-lg">{meta?.label ?? page.title}</span>
//               <div className="flex items-center gap-2 mt-0.5">
//                 <span className="text-xs text-muted-foreground">v{page.version}</span>
//                 <span className="text-xs text-muted-foreground">·</span>
//                 <span
//                   className={`text-xs font-medium ${
//                     page.isActive ? 'text-green-600' : 'text-red-500'
//                   }`}
//                 >
//                   {page.isActive ? 'Activa' : 'Inactiva'}
//                 </span>
//               </div>
//             </div>
//           </CardTitle>

//           <div className="flex items-center gap-3 flex-wrap">
//             <StatusBadge status={saveStatus} />
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setPreview(p => !p)}
//               className="gap-1.5"
//             >
//               {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               {preview ? 'Editor' : 'Vista previa'}
//             </Button>
//             {meta?.preview && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => window.open(meta.preview, '_blank')}
//                 className="gap-1.5"
//               >
//                 <Globe className="h-4 w-4" />
//                 Ver en sitio
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="p-6 space-y-6">
//         {preview ? (
//           /* ── Preview ── */
//           <div className="rounded-xl border border-border overflow-hidden">
//             <div className="px-4 py-2 bg-muted flex items-center gap-2 text-xs text-muted-foreground border-b border-border">
//               <Globe className="h-3 w-3" />
//               Vista previa del contenido (Markdown)
//             </div>
//             <div
//               className="p-6 prose prose-neutral dark:prose-invert max-w-none
//                 prose-headings:text-foreground prose-p:text-muted-foreground
//                 prose-li:text-muted-foreground"
//               dangerouslySetInnerHTML={{
//                 __html: form.content
//                   .replace(/^## (.+)$/gm, '<h2>$1</h2>')
//                   .replace(/^### (.+)$/gm, '<h3>$1</h3>')
//                   .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
//                   .replace(/\*(.+?)\*/g, '<em>$1</em>')
//                   .replace(/^- (.+)$/gm, '<li>$1</li>')
//                   .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
//                   .replace(/^([^<\n].+)$/gm, (line) =>
//                     line.startsWith('<') ? line : `<p>${line}</p>`,
//                   ),
//               }}
//             />
//           </div>
//         ) : (
//           /* ── Editor ── */
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Left column */}
//             <div className="space-y-5">
//               <Field label="Título" hint="Título visible en la página pública">
//                 <Input
//                   value={form.title}
//                   onChange={e => set('title', e.target.value)}
//                   placeholder="Política de Privacidad"
//                 />
//               </Field>

//               <Field label="Slug (URL)" hint="Ruta en la URL: /tu-slug">
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/</span>
//                   <Input
//                     className="pl-6"
//                     value={form.slug}
//                     onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
//                     placeholder="politica-de-privacidad"
//                   />
//                 </div>
//               </Field>

//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Versión" hint="e.g. 1.0, 2.1">
//                   <div className="relative">
//                     <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       className="pl-9"
//                       value={form.version}
//                       onChange={e => set('version', e.target.value)}
//                       placeholder="1.0"
//                     />
//                   </div>
//                 </Field>

//                 <Field label="Idioma">
//                   <select
//                     className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
//                     value={form.language}
//                     onChange={e => set('language', e.target.value)}
//                   >
//                     <option value="es">🇪🇸 Español</option>
//                     <option value="en">🇺🇸 English</option>
//                   </select>
//                 </Field>
//               </div>

//               <Field label="Meta descripción (SEO)" hint="Aparece en resultados de búsqueda">
//                 <Textarea
//                   rows={3}
//                   value={form.metaDescription}
//                   onChange={e => set('metaDescription', e.target.value)}
//                   placeholder="Breve descripción para motores de búsqueda..."
//                 />
//               </Field>

//               {/* Active toggle */}
//               <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
//                 <div>
//                   <p className="font-medium text-sm">Página activa</p>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     Si está inactiva, los visitantes no podrán verla
//                   </p>
//                 </div>
//                 <Switch
//                   checked={form.isActive}
//                   onCheckedChange={val => set('isActive', val)}
//                 />
//               </div>

//               {/* Last updated */}
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <Clock className="h-3.5 w-3.5" />
//                 Última actualización:{' '}
//                 {page.updatedAt.toLocaleDateString('es-ES', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </div>
//             </div>

//             {/* Right column – content editor */}
//             <Field
//               label="Contenido (Markdown)"
//               hint="Usa ## para secciones, **texto** para negrita, - para listas"
//             >
//               <Textarea
//                 rows={22}
//                 value={form.content}
//                 onChange={e => set('content', e.target.value)}
//                 className="font-mono text-sm resize-y"
//                 placeholder="## 1. Sección&#10;&#10;Escribe el contenido aquí..."
//               />
//             </Field>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
//           {dirty && (
//             <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
//               <RotateCcw className="h-4 w-4" />
//               Descartar cambios
//             </Button>
//           )}
//           <Button
//             onClick={handleSave}
//             disabled={!dirty || saveStatus === 'saving'}
//             className="bg-[#5D4E8C] hover:bg-[#4D3E7C] text-white gap-2"
//           >
//             <Save className="h-4 w-4" />
//             {saveStatus === 'saving' ? 'Guardando…' : 'Guardar cambios'}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ── Main admin page ───────────────────────────────────────────
// export function LegalPagesAdmin() {
//   const [pages, setPages] = useState<LegalPage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedId, setSelectedId] = useState<string>('privacy-policy');

//   const load = useCallback(async () => {
//     try {
//       const data = await getLegalPages();
//       setPages(data);
//       if (data.length > 0 && !data.find(p => p.id === selectedId)) {
//         setSelectedId(data[0].id);
//       }
//     } catch {
//       toast.error('Error al cargar páginas legales');
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedId]);

//   useEffect(() => {
//     load();
//     const unsub = subscribeToLegalPages(data => setPages(data));
//     return unsub;
//   }, []);

//   const selectedPage = pages.find(p => p.id === selectedId);

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4E8C]" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="space-y-6"
//       >
//         {/* Page header */}
//         <div className="space-y-1">
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <FileText className="h-6 w-6 text-[#5D4E8C]" />
//             Páginas Legales
//           </h1>
//           <p className="text-muted-foreground text-sm">
//             Gestiona el contenido de Política de Privacidad y Términos de Servicio.
//           </p>
//         </div>

//         {/* Tab selector */}
//         <div className="flex gap-2 flex-wrap">
//           {pages.map(page => {
//             const meta = PAGE_META[page.id as PageId];
//             const Icon = meta?.icon ?? FileText;
//             const active = page.id === selectedId;
//             return (
//               <button
//                 key={page.id}
//                 onClick={() => setSelectedId(page.id)}
//                 className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
//                   active
//                     ? 'bg-[#5D4E8C] text-white border-[#5D4E8C] shadow-md'
//                     : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
//                 }`}
//               >
//                 <Icon className="h-4 w-4 shrink-0" />
//                 {meta?.label ?? page.title}
//                 <ChevronRight
//                   className={`h-3 w-3 transition-transform ${active ? 'rotate-90' : ''}`}
//                 />
//                 <span
//                   className={`w-2 h-2 rounded-full shrink-0 ${
//                     page.isActive ? 'bg-green-400' : 'bg-red-400'
//                   } ${active ? 'bg-opacity-100' : ''}`}
//                 />
//               </button>
//             );
//           })}
//         </div>

//         {/* Editor */}
//         <AnimatePresence mode="wait">
//           {selectedPage ? (
//             <motion.div
//               key={selectedPage.id}
//               initial={{ opacity: 0, x: 10 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -10 }}
//               transition={{ duration: 0.2 }}
//             >
//               <PageEditor page={selectedPage} onSaved={load} />
//             </motion.div>
//           ) : (
//             <Card>
//               <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
//                 <FileText className="h-10 w-10" />
//                 <p className="font-medium">No se encontraron páginas legales</p>
//                 <p className="text-sm">
//                   Ejecuta la migración SQL para crear las páginas por defecto.
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// }