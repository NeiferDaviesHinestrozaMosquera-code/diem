<div align="center">

# ⚡ Digital Emporium

### *Tu agencia digital, potenciada con IA* 🤖✨

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://newdigitalemporium.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

<br/>

> 🏪 Un marketplace de servicios digitales con panel de administración completo,
> generación de cotizaciones con IA y mucho estilo 💜

<br/>

![Digital Emporium Banner](https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80)

</div>

---

## 🎯 ¿Qué es esto?

**Digital Emporium** es una plataforma web completa para una agencia de servicios digitales. Permite a los clientes explorar servicios, ver proyectos, solicitar cotizaciones... y al admin gestionar todo desde un panel súper completo con IA integrada. 

En resumen: el sueño de cualquier agencia digital hecho realidad. 🚀

---

## ✨ Features que hacen brillar los ojos

### 🌐 Lado Cliente
| Feature | Descripción |
|---|---|
| 🏠 **Landing Page** | Hero animado, carrusel de imágenes, servicios destacados |
| 🛠️ **Servicios** | Catálogo completo con descripciones y precios |
| 💼 **Proyectos** | Portfolio con tecnologías, categorías y links |
| 👥 **Equipo** | Perfil de cada miembro con redes sociales |
| ⭐ **Testimonios** | Reseñas reales de clientes |
| 📬 **Contacto** | Info de contacto + WhatsApp directo + mapa |
| 📝 **Cotización** | Formulario inteligente con generación de PDF |
| 🔒 **Privacy Policy** | Secciones dinámicas manejadas desde el admin |
| 📄 **Terms of Service** | Accordion interactivo con contenido editable |
| 🌍 **Multilenguaje** | Español / Inglés con i18next |
| 🌙 **Temas** | Light / Dark / System |

### 🔐 Panel Admin (para los que mandan)
| Feature | Descripción |
|---|---|
| 📊 **Dashboard** | Métricas y resumen del negocio |
| 📋 **Gestión de Cotizaciones** | Ver, filtrar, cambiar status, generar reportes |
| 🤖 **IA con Gemini** | Genera reportes de cotización automáticamente |
| 📄 **Generación de PDF** | Descarga reportes profesionales al instante |
| ⚙️ **Servicios** | CRUD completo con imágenes |
| 🗂️ **Proyectos** | Gestión de portfolio con tecnologías |
| 👤 **Equipo** | Administra miembros, fotos y redes |
| 💬 **Testimonios** | Aprueba y gestiona reseñas |
| 🎨 **Site Settings** | Cambia textos, colores, imágenes en tiempo real |
| 📜 **Privacy Admin** | Editor visual de política de privacidad |
| 📃 **Terms Admin** | Editor drag-and-drop de términos de servicio |

---

## 🛠️ Stack Tecnológico

```
Frontend          → React 18 + TypeScript + Vite
UI Components     → shadcn/ui + Tailwind CSS
Animaciones       → Framer Motion 🎬
Backend/DB        → Supabase (PostgreSQL + Auth + Storage + Realtime)
IA                → Google Gemini (via Supabase Edge Functions)
PDF               → jsPDF
Internacionaliz.  → react-i18next
Forms             → React Hook Form + Zod
Routing           → React Router DOM v6
Notificaciones    → Sonner
Deploy            → Vercel
```

---

## 🚀 Cómo correrlo localmente

### Prerrequisitos
- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com) (gratis)
- Ganas de romperla 💪

### 1. Clona el repo
```bash
git clone https://github.com/NeiferDaviesHinestrozaMosquera-code/diem.git
cd diem
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura variables de entorno
Crea un archivo `.env` en la raíz:
```env
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

> 💡 Encuentra estos valores en tu proyecto de Supabase → **Settings → API**

### 4. Levanta el servidor
```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) y 🎉

---

## 🗄️ Estructura del Proyecto

```
src/
├── 📁 components/
│   ├── layout/          # Header, AdminHeader, Footer
│   └── ui/              # Componentes shadcn/ui
├── 📁 pages/
│   ├── admin/           # Panel administrativo
│   └── *.tsx            # Páginas públicas
├── 📁 services/         # Lógica de Supabase
├── 📁 config/
│   └── gemini.ts        # Integración con IA
├── 📁 types/
│   └── index.ts         # Tipos TypeScript globales
├── 📁 lib/
│   └── utils.ts         # Utilidades compartidas
├── 📁 hooks/            # Custom hooks
├── 📁 contexts/         # Auth, Theme
└── 📁 i18n/             # Traducciones es/en
```

---

## 🤖 Cómo funciona la IA

```
Cliente llena formulario de cotización
         ↓
Se guarda en Supabase (status: pending)
         ↓
Admin presiona "Generar Reporte con IA"
         ↓
Supabase Edge Function llama a Gemini API
         ↓
Gemini analiza el proyecto y devuelve:
  • Tiempo estimado ⏱️
  • Costo total 💰
  • Desglose por área 📊
  • Nivel de dificultad 🎯
  • Equipo necesario 👥
  • Tecnologías recomendadas 🛠️
  • Milestones 🗓️
         ↓
Admin descarga el PDF con el reporte 📄
         ↓
Status cambia a: processed ✅
```

---

## 📦 Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter
```

---

## 🌍 Deploy en Vercel

Este proyecto está configurado para desplegarse en Vercel con **cero configuración**.

El archivo `vercel.json` maneja el routing de la SPA:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Variables de entorno requeridas en Vercel:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

## 🎨 Screenshots

| Vista | Descripción |
|---|---|
| 🏠 Home | Landing page con hero animado |
| 📝 Cotización | Formulario + resultado con PDF |
| 📊 Admin Dashboard | Panel de control completo |
| 🤖 Reporte IA | Análisis automático del proyecto |

---

## 🗺️ Roadmap

- [x] 🌐 Sitio público completo
- [x] 🔐 Panel de administración
- [x] 🤖 Integración con IA (Gemini)
- [x] 📄 Generación de PDFs
- [x] 🌍 Soporte multilenguaje
- [x] ⚡ Realtime con Supabase
- [ ] 📧 Notificaciones por email al cliente
- [ ] 💳 Integración de pagos
- [ ] 📱 App móvil
- [ ] 🔔 Push notifications

---

## 🤝 Contribuir

¿Encontraste un bug? ¿Tienes una idea loca? ¡Abre un issue o manda un PR! 

1. Fork el repo
2. Crea tu branch: `git checkout -b feature/mi-feature-loca`
3. Haz commit: `git commit -m "feat: agrego cosa increíble"`
4. Push: `git push origin feature/mi-feature-loca`
5. Abre un Pull Request 🎉

---

## 📝 Licencia

MIT — úsalo, modifícalo, compártelo. Solo no te olvides de darle ⭐ al repo 😄

---

<div align="center">

**Hecho con 💜 , mucho ☕ y demasiadas horas de depuración de TypeScript**

*[newdigitalemporium.vercel.app](https://newdigitalemporium.vercel.app)*

⭐ Si te gustó el proyecto, dale una estrella — es gratis y me hace feliz ⭐

</div>
