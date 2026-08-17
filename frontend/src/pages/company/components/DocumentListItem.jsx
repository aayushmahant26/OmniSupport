import { FileText, Calendar, Eye, Trash2 } from 'lucide-react';

export const DocumentListItem = ({ doc, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3.5 bg-bgSurfaceElevated border border-borderColor rounded-md">
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div className="w-9 h-9 rounded-full flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center font-bold text-[13px]">
          <FileText size={18} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-sm text-textPrimary text-ellipsis overflow-hidden white-space-nowrap">
            {doc.title}
          </span>
          <span className="text-[11px] text-textSecondary flex items-center gap-1 mt-0.5">
            <Calendar size={12} />
            {new Date(doc.uploaded_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <a
          href={doc.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex p-2 rounded bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover transition-all duration-150"
          title="View document"
        >
          <Eye size={16} />
        </a>

        <button 
          onClick={() => onDelete(doc.id, doc.title)}
          className="inline-flex p-2 rounded bg-error/15 border border-error/30 text-error hover:bg-error/25 transition-all duration-150 cursor-pointer"
          title="Delete document"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default DocumentListItem;
