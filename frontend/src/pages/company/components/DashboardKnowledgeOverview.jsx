import { Link } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';

export const DashboardKnowledgeOverview = ({ documents }) => {
  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm transition-all duration-200 hover:border-primary/40 flex-grow">
      <h2 className="text-lg font-bold text-textPrimary mb-5">RAG Knowledge Base</h2>
      <p className="text-textSecondary text-xs leading-relaxed mb-5">
        Knowledge documents are automatically parsed and split into semantic chunks. These chunks are embedded and indexed into the FAISS vector database to answer customer inquiries.
      </p>

      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto mb-5">
        {documents.slice(0, 3).map((doc) => (
          <div key={doc.id} className="flex items-center gap-2.5 text-xs p-2.5 bg-bgSurfaceElevated rounded border border-borderColor text-textPrimary">
            <FileText size={14} className="text-primary" />
            <span className="overflow-hidden text-ellipsis white-space-nowrap flex-grow">
              {doc.title}
            </span>
          </div>
        ))}
        {documents.length === 0 && (
          <div className="text-center text-textMuted py-4 text-xs">
            No documents uploaded yet.
          </div>
        )}
      </div>

      <Link 
        to="/company/documents" 
        className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px"
      >
        <Upload size={16} />
        <span>Go to Knowledge Manager</span>
      </Link>
    </div>
  );
};

export default DashboardKnowledgeOverview;
