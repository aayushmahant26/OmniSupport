import { Upload, Settings } from 'lucide-react';
import { COMPANY_CATEGORIES } from '../../../constants/categories';

export const CompanyProfileForm = ({
  name,
  setName,
  category,
  setCategory,
  description,
  setDescription,
  logoPreview,
  fileInputRef,
  triggerFileInput,
  handleLogoChange,
  submitting,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      {/* Logo Upload Section */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-textSecondary tracking-wide">Company Business Logo</label>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl border border-borderColor bg-bgSurfaceElevated flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Company logo preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl font-extrabold text-textMuted">?</div>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleLogoChange}
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
            >
              <Upload size={16} />
              <span>Choose Image</span>
            </button>
            <p className="text-[11px] text-textMuted mt-1.5">
              PNG, JPG, or GIF up to 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="company-name">Company Legal Name</label>
        <input
          id="company-name"
          type="text"
          className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15"
          placeholder="e.g. Acme Corp"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Category Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="company-category">Business Category</label>
        <select
          id="company-category"
          className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm text-textPrimary cursor-pointer transition-all duration-150 focus:border-primary"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {COMPANY_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-bgSurface">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="company-description">Description & Business Summary</label>
        <textarea
          id="company-description"
          className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15 min-h-[120px] resize-y"
          placeholder="Detail your business operations, support guidelines, refund rules, and services. The AI customer service agent will use this text as core background reference..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-3 justify-end border-t border-borderColor pt-5 mt-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px min-w-[140px]"
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-1 p-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.16s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.32s]"></div>
            </div>
          ) : (
            <>
              <Settings size={16} />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CompanyProfileForm;
