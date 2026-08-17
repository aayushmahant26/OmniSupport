import { Search, Filter } from 'lucide-react';
import { COMPANY_CATEGORIES } from '../../../constants/categories';

export const CompanySearchFilter = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="bg-bgSurface border border-borderColor rounded-2xl p-5 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
      <div className="flex-grow min-w-[280px] relative">
        <Search 
          size={16} 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted"
        />
        <input
          type="text"
          className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 pl-[42px] pr-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15"
          placeholder="Search companies by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-[220px] relative">
        <Filter 
          size={16} 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
        />
        <select
          className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 pl-[42px] pr-4 text-sm text-textPrimary cursor-pointer transition-all duration-150 focus:border-primary"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {COMPANY_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-bgSurface">
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CompanySearchFilter;
