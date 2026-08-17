import { Building2, FileText, Award } from 'lucide-react';

export const DashboardStats = ({ category, docCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Active Profile */}
      <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[13px]">
          <Building2 size={24} />
        </div>
        <div>
          <div className="text-textSecondary text-[13px] font-semibold">Active Profile</div>
          <div className="text-xl font-bold text-textPrimary mt-0.5">{category}</div>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <div className="w-12 h-12 rounded-full bg-accentPurple/15 text-accentPurple flex items-center justify-center font-bold text-[13px]">
          <FileText size={24} />
        </div>
        <div>
          <div className="text-textSecondary text-[13px] font-semibold">Knowledge Base</div>
          <div className="text-xl font-bold text-textPrimary mt-0.5">
            {docCount} {docCount === 1 ? 'Document' : 'Documents'}
          </div>
        </div>
      </div>

      {/* Chatbot Status */}
      <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center font-bold text-[13px]">
          <Award size={24} />
        </div>
        <div>
          <div className="text-textSecondary text-[13px] font-semibold">Chatbot Status</div>
          <div className="text-xl font-bold mt-0.5 text-success">
            {docCount > 0 ? 'RAG Engine Online' : 'No Knowledge Base'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
