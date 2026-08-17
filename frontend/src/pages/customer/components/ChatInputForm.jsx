import { Send } from 'lucide-react';

export const ChatInputForm = ({
  inputMessage,
  setInputMessage,
  onSubmit,
  sendingMessage,
  activeCompanyName,
}) => {
  return (
    <div className="p-6 md:p-8 border-t border-borderColor bg-bgSurface/30 backdrop-blur-md">
      <form 
        onSubmit={onSubmit} 
        className="flex gap-3 max-w-[900px] mx-auto bg-bgSurfaceElevated border border-borderColor rounded-2xl p-2 shadow-md items-center"
      >
        <textarea
          className="flex-grow h-11 resize-none text-sm py-2.5 px-2 bg-transparent border-none outline-none text-textPrimary"
          placeholder={`Ask a question about ${activeCompanyName}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          rows={1}
        />
        <button 
          type="submit" 
          className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px !h-[38px] !w-[38px] !p-0"
          disabled={sendingMessage || !inputMessage.trim()}
        >
          <Send size={16} />
        </button>
      </form>
      <div className="text-center text-[11px] text-textMuted mt-2">
        AI replies are generated based on official company documentation.
      </div>
    </div>
  );
};

export default ChatInputForm;
