import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

// Recieving props from UploadDocumentPage.jsx
export const DocumentUploadForm = ({
  title,
  setTitle,
  selectedFile,
  uploading,
  successMsg,
  errorMsg,
  onSubmit,
  fileInputRef,
  triggerFileSelect,
  handleFileChange,
  formatBytes,
}) => {
  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200">
      <h2 className="text-lg font-bold text-textPrimary mb-5">Upload Document</h2>

      {successMsg && (
        <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="doc-file">
            Knowledge File (PDF/TXT)
          </label>
          <input
            id="doc-file"
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.txt,text/plain,application/pdf"
            onChange={handleFileChange}
            required
          />
          <div
            className={`border-2 border-dashed border-borderColor rounded-2xl p-10 text-center cursor-pointer bg-bgSurface/35 transition-all duration-150 hover:border-primary hover:bg-primary/10 ${selectedFile ? 'border-primary' : ''
              }`}
            onClick={triggerFileSelect}
          >
            <Upload size={32} className={`mx-auto mb-3 ${selectedFile ? 'text-primary' : 'text-textMuted'}`} />
            {selectedFile ? (
              <div>
                <div className="font-semibold text-sm text-textPrimary break-all">{selectedFile.name}</div>
                <div className="text-xs text-textMuted mt-1">
                  Size: {formatBytes(selectedFile.size)}
                </div>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-sm text-textPrimary">Click to select a file</div>
                <div className="text-xs text-textMuted mt-1">
                  Accepts PDF or TXT documents
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="doc-title">
            Document Title
          </label>
          <input
            id="doc-title"
            type="text"
            className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15"
            placeholder="e.g. Return and Refund Policy v1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px"
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-1 p-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.16s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.32s]"></div>
            </div>
          ) : (
            <>
              <Upload size={16} />
              <span>Upload & Index Document</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DocumentUploadForm;
