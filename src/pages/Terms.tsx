// // pages/TermsOfService.tsx
// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { FileText, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
// import { getLegalPageById } from '@/services/legalPages';
// import type { LegalPage } from '@/types';

// // ── Minimal Markdown renderer ─────────────────────────────────
// function renderMarkdown(md: string): string {
//   return md
//     .replace(/^## (.+)$/gm, '<h2>$1</h2>')
//     .replace(/^### (.+)$/gm, '<h3>$1</h3>')
//     .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
//     .replace(/\*(.+?)\*/g, '<em>$1</em>')
//     .replace(/^- (.+)$/gm, '<li>$1</li>')
//     .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
//     .replace(/^(?!<[hul])(.)/gm, (m) => m)
//     .replace(/^([^<\n].+)$/gm, (line) =>
//       line.startsWith('<') ? line : `<p>${line}</p>`,
//     );
// }

// interface Section {
//   heading: string;
//   body: string;
// }

// function parseSections(markdown: string): Section[] {
//   const lines = markdown.split('\n');
//   const sections: Section[] = [];
//   let current: Section | null = null;
//   for (const line of lines) {
//     const h2 = line.match(/^## (.+)$/);
//     if (h2) {
//       if (current) sections.push(current);
//       current = { heading: h2[1], body: '' };
//     } else if (current) {
//       current.body += line + '\n';
//     }
//   }
//   if (current) sections.push(current);
//   return sections;
// }

// export function TermsOfService() {
//   const [page, setPage] = useState<LegalPage | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [activeSection, setActiveSection] = useState(0);

//   useEffect(() => {
//     getLegalPageById('terms-of-service')
//       .then(setPage)
//       .catch(() => setError(true))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4E8C]" />
//       </div>
//     );
//   }

//   if (error || !page) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
//         <AlertCircle className="h-12 w-12 text-muted-foreground" />
//         <h1 className="text-2xl font-bold">Página no disponible</h1>
//         <p className="text-muted-foreground">
//           No pudimos cargar los Términos de Servicio. Inténtalo más tarde.
//         </p>
//       </div>
//     );
//   }

//   const sections = parseSections(page.content);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero */}
//       <div className="relative bg-gradient-to-br from-[#3D6060] to-[#2A4040] overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage:
//               'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
//             backgroundSize: '20px 20px',
//           }}
//         />
//         <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="flex flex-col items-start gap-4"
//           >
//             <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 text-sm">
//               <FileText className="h-4 w-4" />
//               Documento Legal
//             </div>
//             <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
//               {page.title}
//             </h1>
//             {page.metaDescription && (
//               <p className="text-white/80 text-lg max-w-xl">{page.metaDescription}</p>
//             )}
//             <div className="flex items-center gap-6 text-white/60 text-sm mt-2 flex-wrap">
//               <span className="flex items-center gap-1.5">
//                 <Calendar className="h-4 w-4" />
//                 Actualizado:{' '}
//                 {page.updatedAt.toLocaleDateString('es-ES', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                 })}
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <FileText className="h-4 w-4" />
//                 Versión {page.version}
//               </span>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* Sidebar */}
//           {sections.length > 0 && (
//             <aside className="lg:w-64 shrink-0">
//               <div className="sticky top-24">
//                 <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
//                   Contenido
//                 </h2>
//                 <nav className="space-y-1">
//                   {sections.map((s, i) => (
//                     <button
//                       key={i}
//                       onClick={() => {
//                         setActiveSection(i);
//                         document
//                           .getElementById(`tos-section-${i}`)
//                           ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                       }}
//                       className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
//                         activeSection === i
//                           ? 'bg-[#3D6060]/10 text-[#3D6060] dark:text-teal-400 font-medium'
//                           : 'text-muted-foreground hover:bg-muted hover:text-foreground'
//                       }`}
//                     >
//                       <ChevronRight
//                         className={`h-3 w-3 shrink-0 transition-transform ${
//                           activeSection === i ? 'rotate-90' : ''
//                         }`}
//                       />
//                       <span className="line-clamp-2">{s.heading}</span>
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             </aside>
//           )}

//           {/* Main */}
//           <main className="flex-1 min-w-0">
//             <div className="space-y-10">
//               {sections.map((s, i) => (
//                 <motion.section
//                   key={i}
//                   id={`tos-section-${i}`}
//                   initial={{ opacity: 0, y: 16 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.4, delay: i * 0.04 }}
//                   onViewportEnter={() => setActiveSection(i)}
//                   className="scroll-mt-28"
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3D6060]/10 text-[#3D6060] dark:text-teal-400 text-sm font-bold shrink-0">
//                       {i + 1}
//                     </span>
//                     <h2 className="text-xl font-semibold text-foreground">{s.heading}</h2>
//                   </div>
//                   <div
//                     className="prose prose-neutral dark:prose-invert max-w-none pl-11
//                       prose-p:text-muted-foreground prose-li:text-muted-foreground"
//                     dangerouslySetInnerHTML={{ __html: renderMarkdown(s.body) }}
//                   />
//                   {i < sections.length - 1 && (
//                     <div className="mt-10 border-b border-border" />
//                   )}
//                 </motion.section>
//               ))}
//             </div>

//             {/* Footer note */}
//             <div className="mt-14 p-5 rounded-xl bg-[#3D6060]/5 border border-[#3D6060]/15">
//               <p className="text-sm text-muted-foreground">
//                 <strong className="text-foreground">Última actualización:</strong>{' '}
//                 {page.updatedAt.toLocaleDateString('es-ES', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                 })}
//                 {' · '}
//                 <strong className="text-foreground">Versión:</strong> {page.version}
//               </p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Al utilizar nuestros servicios, aceptas los presentes Términos de Servicio en su totalidad.
//               </p>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }