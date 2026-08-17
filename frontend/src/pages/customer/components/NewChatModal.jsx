import { Bot } from 'lucide-react';

export const NewChatModal = ({
  show,
  availableCompanies,
  onCreateSession,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-6" 
      onClick={onClose}
    >
      <div 
        className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-2xl max-w-[440px] w-full max-h-[70vh] flex flex-col gap-5 animate-[slideUp_0.25s_ease]" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-textPrimary">Choose a Company</h2>
        
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px]">
          {availableCompanies.map((c) => (
            <div 
              key={c.id} 
              onClick={() => onCreateSession(c.id)}
              className="flex items-center gap-3 p-3.5 bg-bgSurfaceElevated border border-borderColor rounded-md cursor-pointer hover:border-primary hover:bg-primary/10 transition-all duration-150"
            >
              <Bot size={16} className="text-primary" />
              <span className="font-semibold text-sm text-textPrimary">{c.name}</span>
            </div>
          ))}

          {availableCompanies.length === 0 && (
            <div className="text-center py-5 text-textMuted text-xs">
              No companies available.
            </div>
          )}
        </div>

        <button 
          type="button" 
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewChatModal;
