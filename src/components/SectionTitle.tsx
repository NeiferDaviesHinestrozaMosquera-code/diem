import './SectionTitle.css';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="section-title-container">
      <div className="section-title-wrapper">
        <h2 className="section-title">
          <span className="title-line"></span>
          {title}
          <span className="title-line"></span>
        </h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SectionTitle;
