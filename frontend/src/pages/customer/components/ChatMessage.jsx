import { useState } from 'react';
import { Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';

export const ChatMessage = ({ msg, onFeedbackSubmitted, companyLogo, activeCompanyName }) => {
  const isUser = msg.role === 'USER';
  const [showUnhelpfulForm, setShowUnhelpfulForm] = useState(false);
  const [missingData, setMissingData] = useState(false);

  // Check if it's a real assistant message with a valid UUID
  const isRealAssistant = !isUser && msg.id && msg.id.length > 10;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed flex flex-col gap-1 ${
          isUser 
            ? 'bg-gradient-to-r from-primary to-accentPurple text-white rounded-br-sm shadow-sm' 
            : 'bg-bgSurface border border-borderColor text-textPrimary rounded-bl-sm'
        }`}
      >
        <div className="flex gap-3.5 items-start">
          {!isUser && (
            <div className="w-7 h-7 rounded-full border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden flex-shrink-0">
              {companyLogo ? (
                <img src={companyLogo} alt={activeCompanyName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[10px] font-extrabold text-textMuted">
                  {activeCompanyName ? activeCompanyName.substring(0, 1).toUpperCase() : '?'}
                </div>
              )}
            </div>
          )}
          
          <div className="flex-grow pre-wrap whitespace-pre-wrap">
            {msg.content
              .replace(/\*\*/g, '')
              .replace(/\n{3,}/g, '\n\n')
              .trim()}
          </div>
          
          {isUser && (
            <div className="w-7 h-7 rounded-full flex-shrink-0 bg-white/20 flex items-center justify-center font-bold text-[13px]">
              <User size={14} />
            </div>
          )}
        </div>

        {isRealAssistant && onFeedbackSubmitted && (
          <>
            {!msg.feedback && !showUnhelpfulForm && (
              <div className="mt-3 pt-3 border-t border-borderColor/50 flex flex-col gap-2">
                <p className="text-[11px] font-medium text-textSecondary">Was this response helpful?</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onFeedbackSubmitted(msg.id, 'helpful', false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-borderColor bg-bgBase hover:bg-bgSurfaceElevated text-xs font-semibold text-textSecondary hover:text-success hover:border-success/30 transition-all duration-150 cursor-pointer"
                  >
                    <ThumbsUp size={12} className="text-textSecondary/80" />
                    Yes, Helpful
                  </button>
                  <button
                    onClick={() => setShowUnhelpfulForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-borderColor bg-bgBase hover:bg-bgSurfaceElevated text-xs font-semibold text-textSecondary hover:text-error hover:border-error/30 transition-all duration-150 cursor-pointer"
                  >
                    <ThumbsDown size={12} className="text-textSecondary/80" />
                    No, Unhelpful
                  </button>
                </div>
              </div>
            )}

            {!msg.feedback && showUnhelpfulForm && (
              <div className="mt-3 pt-3 border-t border-borderColor/50 flex flex-col gap-3">
                <p className="text-[11px] font-semibold text-textSecondary">Why was this response unhelpful?</p>
                <label className="flex items-center gap-2 text-xs text-textSecondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={missingData}
                    onChange={(e) => setMissingData(e.target.checked)}
                    className="rounded border-borderColor text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                  />
                  Information is missing from the company's knowledge base
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onFeedbackSubmitted(msg.id, 'unhelpful', missingData);
                      setShowUnhelpfulForm(false);
                    }}
                    className="px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-accentPurple hover:opacity-95 text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                  <button
                    onClick={() => setShowUnhelpfulForm(false)}
                    className="px-3 py-1.5 rounded-md border border-borderColor bg-bgBase hover:bg-bgSurfaceElevated text-textSecondary text-xs font-medium transition-all duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {msg.feedback && (
              <div className="mt-3 pt-2.5 border-t border-borderColor/30 flex items-center gap-2 text-[11px] text-textSecondary">
                {msg.feedback === 'helpful' ? (
                  <>
                    <div className="p-1 rounded bg-success/10 text-success">
                      <ThumbsUp size={11} className="fill-success/10" />
                    </div>
                    <span className="font-medium text-textSecondary/90">Thanks! You marked this response as helpful.</span>
                  </>
                ) : (
                  <>
                    <div className="p-1 rounded bg-error/10 text-error">
                      <ThumbsDown size={11} className="fill-error/10" />
                    </div>
                    <span className="font-medium text-textSecondary/90">
                      Thanks! You marked this as unhelpful
                      {msg.feedback_missing_data && " (Missing KB data)"}.
                    </span>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
