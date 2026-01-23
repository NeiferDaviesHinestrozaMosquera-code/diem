import { FileText, Clock, DollarSign, TrendingUp, Download, Send } from 'lucide-react';
import { useMouseParallax } from './hooks/useParallax';

interface InquiryCardProps {
  projectId: string;
  title: string;
  description: string;
  status: 'new' | 'analyzing' | 'quoted' | 'approved';
  submittedDate: string;
  duration?: string;
  cost?: string;
  costRange?: string;
  resourceLoad?: string;
  confidence?: string;
  techStack?: string[];
}

export const InquiryCard = ({
  projectId,
  title,
  description,
  status,
  submittedDate,
  duration,
  cost,
  costRange,
  resourceLoad,
  confidence,
  techStack = []
}: InquiryCardProps) => {
  const mousePosition = useMouseParallax(100);

  const statusColors = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    analyzing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    quoted: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    approved: 'bg-green-500/10 text-green-400 border-green-500/30'
  };

  return (
    <div 
      className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
      style={{
        transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
        transition: 'transform 0.3s ease-out, border-color 0.3s, box-shadow 0.3s'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
              {status.toUpperCase()}
            </span>
            <span className="text-slate-500 text-sm">{submittedDate}</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">PROJECT ID: {projectId}</p>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Edit & Send</span>
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>

      {/* AI Analysis Badge */}
      {confidence && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">✨</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-semibold">Gemini AI Analysis Ready</h4>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                {confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Analysis generated based on project description and historical data from 14 similar projects.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {(duration || cost || resourceLoad) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {duration && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-400 uppercase tracking-wide">Est. Duration</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{duration}</p>
              <p className="text-xs text-blue-400">✓ Optimized for Phase 1 MVP</p>
            </div>
          )}

          {cost && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-400 uppercase tracking-wide">Total Est. Cost</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{cost} <span className="text-sm text-slate-400">USD</span></p>
              {costRange && (
                <p className="text-xs text-slate-400">Range: {costRange}</p>
              )}
            </div>
          )}

          {resourceLoad && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-400 uppercase tracking-wide">Resource Load</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{resourceLoad}</p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">AI Recommended Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <div key={tech} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer group/tech">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center group-hover/tech:bg-blue-500/30 transition-colors">
                  <FileText className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <p className="text-sm text-slate-400">Drafted by Gemini. Reviewed by you.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
            Save as Draft
          </button>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Approve & Send Quote
          </button>
        </div>
      </div>
    </div>
  );
};