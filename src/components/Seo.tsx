import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

const SITE_NAME    = 'New Digital Emporium';
const BASE_URL     = 'https://newdigitalemporium.vercel.app';
const DEFAULT_IMG  = `${BASE_URL}/og-image.png`;
const DEFAULT_DESC =
  'Agencia digital especializada en desarrollo web, soluciones de IA, apps móviles y marketing digital. Transformamos tu negocio con tecnología de vanguardia.';
const DEFAULT_KEYWORDS =
  'desarrollo web, agencia digital, inteligencia artificial, apps móviles, marketing digital, diseño UX, e-commerce, cloud, Colombia';

export function SEO({
  title,
  description = DEFAULT_DESC,
  keywords    = DEFAULT_KEYWORDS,
  image       = DEFAULT_IMG,
  url,
  type        = 'website',
  noIndex     = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // ── Standard meta ─────────────────────────────────────────────────
    setMeta('description',       description);
    setMeta('keywords',          keywords);
    setMeta('author',            SITE_NAME);
    setMeta('robots',            noIndex ? 'noindex,nofollow' : 'index,follow');
    setMeta('language',          'Spanish');
    setMeta('revisit-after',     '7 days');

    // ── Canonical ─────────────────────────────────────────────────────
    setLink('canonical', canonical);

    // ── Open Graph ────────────────────────────────────────────────────
    setMeta('og:type',           type,        'property');
    setMeta('og:url',            canonical,   'property');
    setMeta('og:title',          fullTitle,   'property');
    setMeta('og:description',    description, 'property');
    setMeta('og:image',          image,       'property');
    setMeta('og:image:width',    '1200',      'property');
    setMeta('og:image:height',   '630',       'property');
    setMeta('og:site_name',      SITE_NAME,   'property');
    setMeta('og:locale',         'es_CO',     'property');

    // ── Twitter Card ──────────────────────────────────────────────────
    setMeta('twitter:card',        'summary_large_image');
    setMeta('twitter:title',       fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image',       image);

    // ── Theme color ───────────────────────────────────────────────────
    setMeta('theme-color', '#6366f1');

  }, [fullTitle, description, keywords, image, canonical, type, noIndex]);

  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Schema.org helpers  (inyectan JSON-LD en <head>)
// ──────────────────────────────────────────────────────────────────────────────

export function SchemaOrg({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const id    = `schema-${data['@type'] ?? 'generic'}`;
    let script  = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script      = document.createElement('script');
      script.id   = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => { script?.remove(); };
  }, [data]);

  return null;
}

// ── Pre-built schemas ─────────────────────────────────────────────────────────

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'New Digital Emporium',
  url:        'https://newdigitalemporium.vercel.app',
  logo:       'https://newdigitalemporium.vercel.app/logo.png',
  description: DEFAULT_DESC,
  address: {
    '@type':           'PostalAddress',
    addressCountry:    'CO',
    addressLocality:   'Colombia',
  },
  contactPoint: {
    '@type':       'ContactPoint',
    contactType:   'customer service',
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [
    // Añade aquí tus redes sociales cuando las tengas
    // 'https://www.linkedin.com/company/newdigitalemporium',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type':    'WebSite',
  name:       'New Digital Emporium',
  url:        'https://newdigitalemporium.vercel.app',
  potentialAction: {
    '@type':       'SearchAction',
    target:        'https://newdigitalemporium.vercel.app/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const serviceSchema = (serviceName: string, description: string) => ({
  '@context':   'https://schema.org',
  '@type':      'Service',
  name:         serviceName,
  description,
  provider: {
    '@type': 'Organization',
    name:    'New Digital Emporium',
    url:     'https://newdigitalemporium.vercel.app',
  },
  areaServed: {
    '@type': 'Country',
    name:    'Colombia',
  },
});