import { AlertCircle, GitCompare } from 'lucide-react';

export const PolicyComparisonForm = ({
  question,
  setQuestion,
  onSubmit,
  comparing,
  selectedCount,
  errorMsg,
}) => {
  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200">
      <h2 className="text-sm font-bold text-textPrimary mb-4">3. Ask Comparison Question</h2>
      
      {errorMsg && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="compare-query">
            Comparison Prompt
          </label>
          <textarea
            id="compare-query"
            className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15 min-h-[100px] resize-y"
            placeholder="e.g. Compare refund rules, return shipping fees, and customer support channels between the selected companies..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-2.5 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px min-w-[160px] h-10"
            disabled={comparing || selectedCount < 2}
          >
            {comparing ? (
              <div className="flex items-center justify-center gap-1 p-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.16s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.32s]"></div>
              </div>
            ) : (
              <>
                <GitCompare size={16} />
                <span>Compare Policies</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PolicyComparisonForm;
