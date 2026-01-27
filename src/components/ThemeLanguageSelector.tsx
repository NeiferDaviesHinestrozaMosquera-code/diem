import { Languages, Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './ThemeLanguageSelector.css';

interface ThemeLanguageSelectorProps {
  language: string;
  changeLanguage: (lang: string) => void;
  theme: string;
  changeTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeLanguageSelector = ({ 
  language, 
  changeLanguage, 
  theme, 
  changeTheme 
}: ThemeLanguageSelectorProps) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'system':
        return <Monitor size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  return (
    <div className="theme-lang-selector">
      {/* Selector de Idioma */}
      <div className="selector-wrapper" ref={langRef}>
        <button
          className="selector-button"
          onClick={() => {
            setShowLangMenu(!showLangMenu);
            setShowThemeMenu(false);
          }}
          aria-label="Cambiar idioma"
        >
          <Languages size={20} />
          <span className="selector-label">{language.toUpperCase()}</span>
        </button>

        {showLangMenu && (
          <div className="selector-menu">
            <button
              className={`menu-item ${language === 'es' ? 'active' : ''}`}
              onClick={() => {
                changeLanguage('es');
                setShowLangMenu(false);
              }}
            >
              <span className="flag">🇪🇸</span>
              Español
            </button>
            <button
              className={`menu-item ${language === 'en' ? 'active' : ''}`}
              onClick={() => {
                changeLanguage('en');
                setShowLangMenu(false);
              }}
            >
              <span className="flag">🇺🇸</span>
              English
            </button>
          </div>
        )}
      </div>

      {/* Selector de Tema */}
      <div className="selector-wrapper" ref={themeRef}>
        <button
          className="selector-button"
          onClick={() => {
            setShowThemeMenu(!showThemeMenu);
            setShowLangMenu(false);
          }}
          aria-label="Cambiar tema"
        >
          {getThemeIcon()}
        </button>

        {showThemeMenu && (
          <div className="selector-menu">
            <button
              className={`menu-item ${theme === 'light' ? 'active' : ''}`}
              onClick={() => {
                changeTheme('light');
                setShowThemeMenu(false);
              }}
            >
              <Sun size={18} />
              Claro
            </button>
            <button
              className={`menu-item ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => {
                changeTheme('dark');
                setShowThemeMenu(false);
              }}
            >
              <Moon size={18} />
              Oscuro
            </button>
            <button
              className={`menu-item ${theme === 'system' ? 'active' : ''}`}
              onClick={() => {
                changeTheme('system');
                setShowThemeMenu(false);
              }}
            >
              <Monitor size={18} />
              Sistema
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeLanguageSelector;
