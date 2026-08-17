import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { companyApi } from '../../api/companyApi';
import { chatApi } from '../../api/chatApi';
import { Heart, MessageSquare, Trash2, X } from 'lucide-react';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [startingChat, setStartingChat] = useState(null);
  const [zoomedCompany, setZoomedCompany] = useState(null);

  const fetchFavoritesData = async () => {
    try {
      const [companiesData, favoritesData] = await Promise.all([
        companyApi.listCompanies(),
        companyApi.getFavorites()
      ]);
      setCompanies(companiesData);
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error fetching favorites page data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritesData();
  }, []);

  const handleStartChat = async (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company && !company.has_kb) {
      alert(`${company.name} has not uploaded or successfully parsed any knowledge base documents. Chat is disabled.`);
      return;
    }

    setStartingChat(companyId);
    try {
      const session = await chatApi.createSession(companyId);
      navigate(`/customer/chat/${session.id}`);
    } catch (err) {
      console.error('Error starting chat', err);
      alert(err.response?.data?.error || 'Could not start chat session. Please verify if the company is active.');
    } finally {
      setStartingChat(null);
    }
  };

  const handleRemoveFavorite = async (category) => {
    if (window.confirm('Are you sure you want to remove this favorite company?')) {
      try {
        await companyApi.setFavorite(category, null);
        setFavorites((prev) => {
          const updated = { ...prev };
          delete updated[category];
          return updated;
        });
      } catch (err) {
        console.error('Error removing favorite', err);
      }
    }
  };

  // Find companies that are favorites for their respective categories
  const favoriteCompanies = companies
    .filter((company) => favorites[company.category] === company.id)
    .sort((a, b) => a.category.localeCompare(b.category)); // Sort by category ascending (A to Z)

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
        <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Favorite Companies</h1>
        <p className="text-textSecondary text-sm mt-1">
          Your preferred companies categorized by business vertical
        </p>
      </div>

      {favoriteCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-bgSurface border border-borderColor rounded-2xl max-w-[600px] mx-auto gap-4 mt-8 shadow-sm">
          <Heart size={48} className="text-textMuted stroke-1" />
          <div>
            <h3 className="font-bold text-textPrimary text-base">No Favorites Yet</h3>
            <p className="text-textSecondary text-xs max-w-[320px] mt-1.5 leading-relaxed">
              Compare policy documents between companies and select your preferred company in each business category!
            </p>
          </div>
          <Link
            to="/customer/compare"
            className="inline-flex items-center justify-center gap-2 font-semibold text-xs py-2.5 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px mt-2"
          >
            Go to Compare Policies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCompanies.map((company) => {
            const logoUrl = company.logo 
              ? (company.logo.startsWith('http') ? company.logo : `${window.location.origin}${company.logo}`) 
              : null;

            return (
              <div 
                key={company.id} 
                className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex flex-col gap-4 justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div 
                      onClick={() => logoUrl && setZoomedCompany(company)}
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
                      <h3 className="text-base font-bold text-textPrimary text-ellipsis overflow-hidden white-space-nowrap">{company.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-error/15 text-error mt-1 uppercase tracking-wider flex-shrink-0">
                        ❤️ {company.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-textSecondary text-xs leading-relaxed line-clamp-3 min-h-[58px]">
                    {company.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 border-t border-borderColor pt-3.5 mt-2">
                  <button
                    onClick={() => handleRemoveFavorite(company.category)}
                    className="inline-flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-3 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-error hover:bg-error/10 hover:border-error/20"
                  >
                    <Trash2 size={14} />
                    <span>Unfavorite</span>
                  </button>
                  <button
                    onClick={company.has_kb ? () => handleStartChat(company.id) : undefined}
                    className={`inline-flex items-center justify-center gap-1.5 font-semibold text-xs py-2 px-3 rounded-md transition-all duration-150 text-center ${
                      company.has_kb
                        ? "bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px cursor-pointer"
                        : "bg-borderColor text-textMuted cursor-not-allowed opacity-60"
                    }`}
                    disabled={startingChat === company.id || !company.has_kb}
                    title={!company.has_kb ? "Chat disabled: No knowledge base uploaded or parsed successfully." : "Start chat session"}
                  >
                    {startingChat === company.id ? (
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
              </div>
            );
          })}
        </div>
      )}

      {/* Zoomed Logo Modal Overlay - portal to body */}
      {zoomedCompany && createPortal(
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease]"
          onClick={() => setZoomedCompany(null)}
        >
          <div 
            className="relative bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-2xl w-[96vw] h-[96vh] max-w-[96vw] max-h-[96vh] flex flex-col items-center justify-center animate-[slideUp_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setZoomedCompany(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/85 text-white rounded-full p-2 cursor-pointer transition-all duration-150 hover:scale-105 z-10"
            >
              <X size={18} />
            </button>
            <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
              <img 
                src={zoomedCompany.logo.startsWith('http') ? zoomedCompany.logo : `${window.location.origin}${zoomedCompany.logo}`} 
                alt={zoomedCompany.name} 
                className="max-w-full max-h-full rounded-lg object-contain" 
              />
            </div>
            <div className="text-textPrimary font-bold text-center mt-3 text-sm">{zoomedCompany.name} Logo</div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FavoritesPage;
