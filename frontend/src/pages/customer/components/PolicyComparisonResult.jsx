import { useState } from 'react';
import { Sparkles, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export const PolicyComparisonResult = ({
  comparing,
  result,
  onFeedbackSubmitted
}) => {
  const [showUnhelpfulForm, setShowUnhelpfulForm] = useState(false);
  const [missingData, setMissingData] = useState(false);

  const answer = result?.answer;
  const feedback = result?.feedback;
  const feedback_missing_data = result?.feedback_missing_data;

  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200 flex-grow min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-borderColor pb-3">
        <h2 className="text-sm font-bold text-textPrimary flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span>Comparative AI Synthesis</span>
        </h2>
      </div>

      {comparing ? (
        <div className="flex flex-grow items-center justify-center flex-col gap-3">
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <span className="text-xs text-textSecondary">
            Retrieving chunks and synthesising comparison...
          </span>
        </div>
      ) : answer ? (
        <div className="flex flex-col flex-grow justify-between">
          <div className="text-[14.5px] leading-[1.6] text-textPrimary whitespace-pre-wrap pre-wrap tracking-wide pr-2 py-1 flex-grow">
            {answer
              .replace(/[I|l](?=\d)/g, '')
              .replace(/\*\*/g, '')
              .replace(/\n{3,}/g, '\n\n')
              .trim()}
          </div>

          {onFeedbackSubmitted && (
            <div className="mt-6 pt-4 border-t border-borderColor/60">
              {!feedback && !showUnhelpfulForm && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-semibold text-textSecondary">Was this comparison helpful?</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onFeedbackSubmitted('helpful', false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-borderColor bg-bgBase hover:bg-bgSurfaceElevated text-xs font-semibold text-textSecondary hover:text-success hover:border-success/30 transition-all duration-150 cursor-pointer animate-[fadeIn_0.15s_ease]"
                    >
                      <ThumbsUp size={12} className="text-textSecondary/80" />
                      Yes, Helpful
                    </button>
                    <button
                      onClick={() => setShowUnhelpfulForm(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-borderColor bg-bgBase hover:bg-bgSurfaceElevated text-xs font-semibold text-textSecondary hover:text-error hover:border-error/30 transition-all duration-150 cursor-pointer animate-[fadeIn_0.15s_ease]"
                    >
                      <ThumbsDown size={12} className="text-textSecondary/80" />
                      No, Unhelpful
                    </button>
                  </div>
                </div>
              )}

              {!feedback && showUnhelpfulForm && (
                <div className="flex flex-col gap-3 animate-[fadeIn_0.15s_ease]">
                  <p className="text-[11px] font-semibold text-textSecondary">Why was this comparison unhelpful?</p>
                  <label className="flex items-center gap-2 text-xs text-textSecondary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={missingData}
                      onChange={(e) => setMissingData(e.target.checked)}
                      className="rounded border-borderColor text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                    />
                    Information is missing from the compared companies' knowledge bases
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onFeedbackSubmitted('unhelpful', missingData);
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

              {feedback && (
                <div className="flex items-center gap-2 text-[11px] text-textSecondary animate-[fadeIn_0.2s_ease]">
                  {feedback === 'helpful' ? (
                    <>
                      <div className="p-1 rounded bg-success/10 text-success">
                        <ThumbsUp size={11} className="fill-success/10" />
                      </div>
                      <span className="font-semibold text-textSecondary/90">Thanks! You marked this comparison response as helpful.</span>
                    </>
                  ) : (
                    <>
                      <div className="p-1 rounded bg-error/10 text-error">
                        <ThumbsDown size={11} className="fill-error/10" />
                      </div>
                      <span className="font-semibold text-textSecondary/90">
                        Thanks! You marked this comparison as unhelpful
                        {feedback_missing_data && " (Missing KB data for compared companies)"}.
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-grow flex-col items-center justify-center text-textMuted text-center p-8 gap-3">
          <HelpCircle size={36} />
          <span className="text-xs leading-relaxed max-w-[280px]">
            Choose at least 2 companies, type your question, and click "Compare Policies" to view synthesis.
          </span>
        </div>
      )}
    </div>
  );
};

export default PolicyComparisonResult;
