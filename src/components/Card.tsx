import { LucideIcon } from 'lucide-react';
import './Card.css';

interface CardProps {
  image?: string;
  title: string;
  description: string;
  link?: string;
  icon?: LucideIcon | (() => JSX.Element);
}

const Card = ({ image, title, description, link, icon: Icon }: CardProps) => {
  return (
    <div className="card-container">
      <div className="card-content">
        {image && (
          <div className="card-image-wrapper">
            <img src={image} alt={title} className="card-image" />
            <div className="card-blur-divider"></div>
          </div>
        )}
        
        {Icon && (
          <div className="card-icon-wrapper">
            {typeof Icon === 'function' && Icon.prototype === undefined ? (
              <Icon />
            ) : (
              <Icon className="card-icon" />
            )}
            <div className="card-blur-divider"></div>
          </div>
        )}

        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          {link && (
            <a href={link} className="card-link">
              Leer más →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
