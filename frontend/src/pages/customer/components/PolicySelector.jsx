import { CheckCircle2, Heart } from 'lucide-react';
import { COMPANY_CATEGORIES } from '../../../constants/categories';

export const PolicySelector = ({
  companies,
  selectedCategory,
  setSelectedCategory,
  selectedCompanyIds,
  onToggleSelect,
  hasCompared,
  favorites,
  onSetFavorite,
}) => {
  // Filter list of selectable companies by category
  const filteredCompanies = companies.filter((c) => {
    return c.category === selectedCategory;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filter */}
      <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200">
        <h2 className="text-sm font-bold text-textPrimary mb-4">1. Filter Category</h2>
        <select
          className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm text-textPrimary cursor-pointer transition-all duration-150 focus:border-primary mb-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a Category...</option>
          {COMPANY_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-bgSurface">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Select Companies */}
      {selectedCategory && (
        <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-bold text-textPrimary">2. Select Companies</h2>
            <p className="text-[11px] text-textSecondary mt-0.5">
              Currently selected: {selectedCompanyIds.length} {selectedCompanyIds.length === 1 ? 'company' : 'companies'}
            </p>
          </div>

          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto">
            {filteredCompanies.map((company) => {
              const isSelected = selectedCompanyIds.includes(company.id);
              const isFavorite = favorites[selectedCategory] === company.id;
              const hasKb = company.has_kb;
              return (
                <div
                  key={company.id}
                  className={`flex items-center justify-between p-3 bg-bgSurfaceElevated border rounded-md transition-all duration-150 ${
                    !hasKb
                      ? 'border-borderColor opacity-50 cursor-not-allowed'
                      : isSelected 
                        ? 'border-primary bg-primary/10 cursor-pointer' 
                        : 'border-borderColor hover:border-primary/30 cursor-pointer'
                  }`}
                  onClick={() => onToggleSelect(company.id)}
                  title={!hasKb ? "This company has not uploaded or successfully parsed any knowledge base documents." : ""}
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-semibold text-xs text-textPrimary text-ellipsis white-space-nowrap overflow-hidden flex items-center gap-1.5">
                      <span className={!hasKb ? "text-textMuted" : ""}>{company.name}</span>
                      {isFavorite && (
                        <Heart size={11} className="text-error fill-error flex-shrink-0 animate-[pulse_2s_infinite]" title="Your favorite in this category" />
                      )}
                      {!hasKb && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-error/10 text-error border border-error/20 flex-shrink-0">
                          NO KB
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-textMuted mt-0.5">
                      {company.category}
                    </div>
                  </div>
                  {isSelected && hasKb && (
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  )}
                </div>
              );
            })}

            {filteredCompanies.length === 0 && (
              <div className="text-center text-textMuted py-5 text-xs">
                No companies found in this category
              </div>
            )}
          </div>
        </div>
      )}

      {/* Select Favorite Company (appears after comparison results generated) */}
      {selectedCategory && hasCompared && (
        <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-200 flex flex-col gap-3 animation-fadeIn">
          <div className="flex items-center gap-2 mb-0.5">
            <Heart size={16} className="text-error fill-error" />
            <h2 className="text-sm font-bold text-textPrimary">3. Favorite Company</h2>
          </div>
          <p className="text-[11px] text-textSecondary leading-relaxed">
            Based on the AI synthesis, select your favorite company in the <strong>{selectedCategory}</strong> category:
          </p>
          <select
            className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 px-4 text-sm text-textPrimary cursor-pointer transition-all duration-150 focus:border-primary"
            value={favorites[selectedCategory] || ""}
            onChange={(e) => onSetFavorite(selectedCategory, e.target.value)}
          >
            <option value="">None (No Favorite)</option>
            {filteredCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default PolicySelector;
