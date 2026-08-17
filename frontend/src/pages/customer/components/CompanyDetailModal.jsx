import { ArrowRight } from 'lucide-react';

export const CompanyDetailModal = ({
  company,
  onClose,
  onStartChat,
}) => {
  if (!company) return null;

  const logoUrl = company.logo 
    ? (company.logo.startsWith('http') ? company.logo : `${window.location.origin}${company.logo}`) 
    : null;

  return (
    <div 
      className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-[fadeIn_0.2s_ease]" 
      onClick={onClose}
    >
      <div 
        className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-2xl max-w-[600px] w-full max-h-[85vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-5 mb-5">
          <div className="w-20 h-20 rounded-2xl border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={company.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-3xl font-extrabold text-textMuted">
                {company.name ? company.name.substring(0, 1).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-textPrimary">{company.name}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mt-1.5">
              {company.category}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-[13px] font-semibold text-textSecondary mb-2">Business Description</h4>
          <p className="text-textPrimary text-sm leading-relaxed bg-bgSurfaceElevated p-4 rounded-md border border-borderColor">
            {company.description}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
          >
            Close
          </button>
          <button
            type="button"
            onClick={company.has_kb ? onStartChat : undefined}
            className={`inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md transition-all duration-150 text-center ${
              company.has_kb
                ? "bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px cursor-pointer"
                : "bg-borderColor text-textMuted cursor-not-allowed opacity-60"
            }`}
            disabled={!company.has_kb}
            title={!company.has_kb ? "Chat disabled: No knowledge base uploaded or parsed successfully." : "Start chat session"}
          >
            <span>{company.has_kb ? "Start AI Support Chat" : "No Knowledge Base"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;
