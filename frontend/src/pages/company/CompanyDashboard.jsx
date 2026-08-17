import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyApi } from '../../api/companyApi';
import { documentApi } from '../../api/documentApi';
import { Settings, ShieldAlert } from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import DashboardDetails from './components/DashboardDetails';
import DashboardKnowledgeOverview from './components/DashboardKnowledgeOverview';

export const CompanyDashboard = () => {
  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch company profile
        const compData = await companyApi.getMyCompany();
        setCompany(compData);
        setHasProfile(true);

        // Fetch documents
        const docsData = await documentApi.listDocuments();
        setDocuments(docsData);
      } catch (err) {
        console.error('Error fetching company details', err);
        // If 404, it means company profile is not created yet
        if (err.response?.status === 404 || err.response?.data?.detail?.includes('not found')) {
          setHasProfile(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-5 flex flex-col gap-5">
        <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm h-[200px] flex items-center justify-center">
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Company Dashboard</h1>
          <p className="text-textSecondary text-sm mt-1">Manage your company's AI profile and documentation</p>
        </div>

        <div className="bg-bgSurface border border-borderColor rounded-2xl p-10 max-w-[600px] mx-auto my-10 text-center shadow-md">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 bg-warning/10 text-warning flex items-center justify-center font-bold text-[13px]">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-textPrimary">Profile Setup Required</h2>
          <p className="text-textSecondary mb-8 text-sm leading-relaxed">
            You haven't created a company profile yet. To configure your AI assistant, upload your business logo, and feed knowledge documents to RAG, you need to set up your profile first.
          </p>
          <Link to="/company/profile" className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-8 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px">
            <Settings size={18} />
            <span>Create Profile Now</span>
          </Link>
        </div>
      </div>
    );
  }

  // Display logo URL properly or handle relative backend assets
  const logoUrl = company?.logo 
    ? (company.logo.startsWith('http') ? company.logo : `${window.location.origin}${company.logo}`) 
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Welcome back, {company?.name}</h1>
        <p className="text-textSecondary text-sm mt-1">Here is a quick overview of your AI assistant knowledge base</p>
      </div>

      {/* Stats row */}
      <DashboardStats category={company?.category} docCount={documents.length} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-7">
        {/* Profile Details Card */}
        <DashboardDetails company={company} logoUrl={logoUrl} />

        {/* Quick Links / Docs Overview */}
        <div className="flex flex-col gap-6">
          <DashboardKnowledgeOverview documents={documents} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
