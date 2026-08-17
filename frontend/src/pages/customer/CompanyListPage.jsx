import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../../api/companyApi';
import { chatApi } from '../../api/chatApi';
import { Building } from 'lucide-react';
import CompanySearchFilter from './components/CompanySearchFilter';
import CompanyCard from './components/CompanyCard';
import CompanyDetailModal from './components/CompanyDetailModal';
import { COMPANY_CATEGORIES } from '../../constants/categories';

export const CompanyListPage = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal / Detail view
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [startingChat, setStartingChat] = useState(null);

  useEffect(() => {
    const fetchCompaniesAndFavorites = async () => {
      try {
        const [companiesData, favoritesData] = await Promise.all([
          companyApi.listCompanies(),
          companyApi.getFavorites()
        ]);
        setCompanies(companiesData);
        setFavorites(favoritesData);
      } catch (err) {
        console.error('Error listing companies or favorites', err);
        setError('Failed to retrieve companies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesAndFavorites();
  }, []);

  const handleStartChat = async (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company && !company.has_kb) {
      alert(`${company.name} has not uploaded or successfully parsed any knowledge base documents. Chat is disabled.`);
      return;
    }

    setStartingChat(companyId);
    try {
      // Create chat session
      const session = await chatApi.createSession(companyId);
      // Redirect to the chat page with the session UUID
      navigate(`/customer/chat/${session.id}`);
    } catch (err) {
      console.error('Error starting chat', err);
      alert(err.response?.data?.error || 'Could not start chat session. Please verify if the company is active.');
    } finally {
      setStartingChat(null);
    }
  };

  // Filter companies based on search and category choice
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || company.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const labelA = COMPANY_CATEGORIES.find(c => c.value === a.category)?.label || a.category;
    const labelB = COMPANY_CATEGORIES.find(c => c.value === b.category)?.label || b.category;
    const catCompare = labelA.localeCompare(labelB);
    if (catCompare !== 0) return catCompare;
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Directory of Companies</h1>
        <p className="text-textSecondary text-sm mt-1">Select a company to start an automated AI support session or compare policies</p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <CompanySearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            isFavorite={favorites[company.category] === company.id}
            onViewDetail={() => setSelectedCompany(company)}
            onStartChat={() => handleStartChat(company.id)}
            startingChat={startingChat === company.id}
          />
        ))}

        {filteredCompanies.length === 0 && (
          <div className="col-span-full text-center py-16 text-textMuted">
            <Building size={48} className="mx-auto mb-4 text-borderColor" />
            <p className="text-sm">No companies found matching the filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detail Modal Overlay */}
      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onStartChat={() => {
          const id = selectedCompany.id;
          setSelectedCompany(null);
          handleStartChat(id);
        }}
      />
    </div>
  );
};

export default CompanyListPage;
