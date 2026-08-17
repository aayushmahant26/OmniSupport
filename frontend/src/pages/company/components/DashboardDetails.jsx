import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export const DashboardDetails = ({ company, logoUrl }) => {
  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm transition-all duration-200 hover:border-primary/40">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-textPrimary">Company Details</h2>
        <Link 
          to="/company/profile" 
          className="inline-flex items-center justify-center gap-2 font-semibold text-[13px] py-2 px-4 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
        >
          <Settings size={14} />
          <span>Edit Profile</span>
        </Link>
      </div>

      <div className="flex items-center gap-5 mb-6">
        <div className="w-24 h-24 rounded-2xl border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={company?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl font-extrabold text-textMuted">
              {company?.name ? company.name.substring(0, 1).toUpperCase() : '?'}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-textPrimary">{company?.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mt-1.5">
            {company?.category}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-textSecondary mb-2">Company Description</h4>
        <p className="text-textPrimary text-sm leading-relaxed bg-bgSurfaceElevated p-4 rounded-md border border-borderColor">
          {company?.description}
        </p>
      </div>
    </div>
  );
};

export default DashboardDetails;
