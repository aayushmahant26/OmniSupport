import { useEffect, useState } from 'react';
import { companyApi } from '../../api/companyApi';
import { comparisonApi } from '../../api/comparisonApi';
import { chatApi } from '../../api/chatApi';
import PolicySelector from './components/PolicySelector';
import PolicyComparisonForm from './components/PolicyComparisonForm';
import PolicyComparisonResult from './components/PolicyComparisonResult';

export const ComparisonPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Favorites & Comparison status
  const [favorites, setFavorites] = useState({});
  const [hasCompared, setHasCompared] = useState(false);

  // Chat/Query states
  const [question, setQuestion] = useState('');
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  // Error feedback
  const [errorMsg, setErrorMsg] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesAndFavorites();
  }, []);

  const handleToggleSelectCompany = (id) => {
    const company = companies.find(c => c.id === id);
    if (company && !company.has_kb) {
      setErrorMsg(`${company.name} has not uploaded or successfully parsed any knowledge base documents and cannot be compared.`);
      return;
    }
    setErrorMsg(null);
    setSelectedCompanyIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cId) => cId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedCompanyIds([]);
    setErrorMsg(null);
    setComparisonResult(null);
    setHasCompared(false);
  };

  const handleSetFavorite = async (category, companyId) => {
    try {
      await companyApi.setFavorite(category, companyId);
      setFavorites((prev) => ({
        ...prev,
        [category]: companyId
      }));
    } catch (err) {
      console.error('Error setting favorite company', err);
      alert('Could not save favorite selection. Please try again.');
    }
  };

  const handleCompareSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setComparisonResult(null);

    if (selectedCompanyIds.length < 2) {
      setErrorMsg('Please select at least 2 companies to compare policies.');
      return;
    }

    if (!question.trim()) {
      setErrorMsg('Please enter a comparison question.');
      return;
    }

    setComparing(true);
    try {
      const response = await comparisonApi.compareCompanies(selectedCompanyIds, question);
      setComparisonResult({
        answer: response.answer,
        messages: response.messages, // list of {company_id, message_id}
        feedback: null,
        feedback_missing_data: false
      });
      setHasCompared(true);
    } catch (err) {
      console.error('Comparison error', err);
      setErrorMsg('Failed to fetch AI comparison result. Ensure your Ollama models are online.');
    } finally {
      setComparing(false);
    }
  };

  const handleFeedbackSubmitted = async (feedback, missingData) => {
    if (!comparisonResult || !comparisonResult.messages) return;

    try {
      // Loop through all comparison messages created on the backend and rate them
      const promises = comparisonResult.messages.map((item) =>
        chatApi.submitFeedback(item.message_id, feedback, missingData)
      );
      await Promise.all(promises);

      // Save feedback state locally
      setComparisonResult((prev) => ({
        ...prev,
        feedback,
        feedback_missing_data: missingData
      }));
    } catch (err) {
      console.error('Error submitting feedback', err);
      alert('Could not submit rating. Please try again.');
    }
  };

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
        <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Policy Comparison Chatbot</h1>
        <p className="text-textSecondary text-sm mt-1">Select multiple companies and ask policy comparison questions side-by-side</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8 items-start">
        {/* Selector Column Component */}
        <PolicySelector
          companies={companies}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          selectedCompanyIds={selectedCompanyIds}
          onToggleSelect={handleToggleSelectCompany}
          hasCompared={hasCompared}
          favorites={favorites}
          onSetFavorite={handleSetFavorite}
        />

        {/* Input & Output Column */}
        <div className="flex flex-col gap-6">
          {/* Query input card Component */}
          <PolicyComparisonForm
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleCompareSubmit}
            comparing={comparing}
            selectedCount={selectedCompanyIds.length}
            errorMsg={errorMsg}
          />

          {/* Results Card Component */}
          <PolicyComparisonResult
            comparing={comparing}
            result={comparisonResult}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
