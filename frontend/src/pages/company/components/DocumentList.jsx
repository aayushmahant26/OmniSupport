import { FileText } from 'lucide-react';
import DocumentListItem from './DocumentListItem';

export const DocumentList = ({ documents, loading, onDelete }) => {
  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200 min-h-[400px]">
      <h2 className="text-lg font-bold text-textPrimary mb-5">Indexed Documents</h2>

      {loading ? (
        <div className="flex h-[150px] items-center justify-center">
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-textMuted gap-2">
          <FileText size={32} />
          <span className="text-sm">No documents have been indexed yet</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <DocumentListItem key={doc.id} doc={doc} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
