import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, MessageSquare, Heart, FileText, X, ExternalLink } from 'lucide-react';
import { documentApi } from '../../../api/documentApi';

export const CompanyCard = ({
  company,
  onViewDetail,
  onStartChat,
  startingChat,
  isFavorite,
}) => {
  const [showZoomedLogo, setShowZoomedLogo] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const logoUrl = company.logo 
    ? (company.logo.startsWith('http') ? company.logo : `${window.location.origin}${company.logo}`) 
    : null;

  const handleFetchDocs = async (e) => {
    e.stopPropagation();
    setShowDocsModal(true);
    setLoadingDocs(true);
    try {
      const data = await documentApi.listCompanyDocuments(company.id);
      setDocs(data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  return (
    <div className="relative bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex flex-col gap-4 justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-4 overflow-hidden">
            <div 
              onClick={() => logoUrl && setShowZoomedLogo(true)}
              className={`w-14 h-14 rounded-md border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden flex-shrink-0 transition-all ${
                logoUrl ? 'cursor-pointer hover:border-primary/55 hover:shadow-md hover:scale-[1.02]' : ''
              }`}
              title={logoUrl ? "Click to enlarge logo" : ""}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl font-extrabold text-textMuted">
                  {company.name ? company.name.substring(0, 1).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-base font-bold text-textPrimary text-ellipsis overflow-hidden white-space-nowrap" title={company.name}>
                {company.name}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary mt-1">
                {company.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isFavorite && (
              <div className="text-error fill-error animate-[pulse_2s_infinite] p-1" title="Favorited Company">
                <Heart size={14} className="fill-error text-error" />
              </div>
            )}
            <button
              onClick={handleFetchDocs}
              className="text-textSecondary hover:text-primary transition-all duration-150 p-1.5 rounded-full hover:bg-bgSurfaceElevated cursor-pointer"
              title="View Uploaded Documents"
            >
              <FileText size={16} />
            </button>
          </div>
        </div>

        <p className="text-textSecondary text-xs leading-relaxed line-clamp-3 min-h-[58px]">
          {company.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 border-t border-borderColor pt-3.5">
        <button
          onClick={onViewDetail}
          className="inline-flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-3 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
        >
          <BookOpen size={14} />
          <span>Detail Info</span>
        </button>
        <button
          onClick={company.has_kb ? onStartChat : undefined}
          className={`inline-flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-3 rounded-md transition-all duration-150 text-center ${
            company.has_kb
              ? "bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px cursor-pointer"
              : "bg-borderColor text-textMuted cursor-not-allowed opacity-60"
          }`}
          disabled={startingChat || !company.has_kb}
          title={!company.has_kb ? "Chat disabled: No knowledge base uploaded or parsed successfully." : "Start chat session"}
        >
          {startingChat ? (
            <div className="flex items-center gap-1 p-0">
              <div className="w-1 h-1 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both]"></div>
              <div className="w-1 h-1 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.16s]"></div>
            </div>
          ) : (
            <>
              <MessageSquare size={14} />
              <span>{company.has_kb ? "Chat AI" : "No KB"}</span>
            </>
          )}
        </button>
      </div>

      {/* Zoomed Logo Modal Overlay - portal to body */}
      {showZoomedLogo && logoUrl && createPortal(
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease]"
          onClick={() => setShowZoomedLogo(false)}
        >
          <div 
            className="relative bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-2xl w-[96vw] h-[96vh] max-w-[96vw] max-h-[96vh] flex flex-col items-center justify-center animate-[slideUp_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowZoomedLogo(false)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/85 text-white rounded-full p-2 cursor-pointer transition-all duration-150 hover:scale-105 z-10"
            >
              <X size={18} />
            </button>
            <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
              <img src={logoUrl} alt={company.name} className="max-w-full max-h-full rounded-lg object-contain" />
            </div>
            <div className="text-textPrimary font-bold text-center mt-3 text-sm">{company.name} Logo</div>
          </div>
        </div>,
        document.body
      )}

      {/* Documents Modal Overlay - portal to body */}
      {showDocsModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease]"
          onClick={() => setShowDocsModal(false)}
        >
          <div 
            className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-2xl max-w-[500px] w-full max-h-[75vh] flex flex-col justify-between animate-[slideUp_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-borderColor pb-3 mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText size={20} />
                  <h3 className="font-bold text-textPrimary text-base">Uploaded Documents</h3>
                </div>
                <button 
                  onClick={() => setShowDocsModal(false)}
                  className="text-textSecondary hover:text-textPrimary transition-all duration-150 p-1.5 rounded-full hover:bg-bgSurfaceElevated cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="text-textSecondary text-xs mb-3">
                Knowledge Base files for <strong>{company.name}</strong>
              </div>

              {loadingDocs ? (
                <div className="flex h-[150px] items-center justify-center">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              ) : docs.length === 0 ? (
                <div className="text-center py-12 text-textMuted text-xs flex flex-col gap-2">
                  <FileText size={32} className="mx-auto text-borderColor stroke-1" />
                  <p>No documents uploaded by this company yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-bgSurfaceElevated border border-borderColor rounded-lg hover:border-primary/30 transition-all">
                      <div className="overflow-hidden pr-2">
                        <div className="font-semibold text-xs text-textPrimary text-ellipsis overflow-hidden white-space-nowrap" title={doc.title}>
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-textMuted mt-0.5">
                          Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                      <a 
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 font-semibold text-[10px] py-1 px-2.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer flex-shrink-0"
                      >
                        <span>View</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-borderColor pt-4 mt-5 flex justify-end">
              <button 
                onClick={() => setShowDocsModal(false)}
                className="font-semibold text-xs py-2.5 px-5 rounded-md cursor-pointer bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CompanyCard;
