import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companyApi } from '../../api/companyApi';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import CompanyProfileForm from './components/CompanyProfileForm';

export const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ECOMMERCE');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // UI Feedback
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await companyApi.getMyCompany();
        setName(data.name);
        setCategory(data.category);
        setDescription(data.description);
        setHasProfile(true);
        if (data.logo) {
          const formattedLogo = data.logo.startsWith('http') ? data.logo : `${window.location.origin}${data.logo}`;
          setLogoPreview(formattedLogo);
        }
      } catch (err) {
        console.error('No company profile found', err);
        if (err.response?.status === 404 || err.response?.data?.detail?.includes('not found')) {
          setHasProfile(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      // 1. Create or Update Company Metadata
      if (hasProfile) {
        await companyApi.updateCompany({ name, category, description });
      } else {
        await companyApi.createCompany({ name, category, description });
        setHasProfile(true);
      }

      // 2. Upload Logo if selected
      if (logoFile) {
        const logoData = await companyApi.uploadLogo(logoFile);
        if (logoData.logo) {
          const formattedLogo = logoData.logo.startsWith('http') ? logoData.logo : `${window.location.origin}${logoData.logo}`;
          setLogoPreview(formattedLogo);
        }
      }

      setSuccessMsg('Company profile saved successfully!');
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error saving profile', err);
      let errMsg = 'Failed to save company profile.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          errMsg = Object.entries(data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
            .join(' | ');
        } else if (typeof data === 'string') {
          errMsg = data;
        }
      }
      setErrorMsg(errMsg);
    } finally {
      setSubmitting(false);
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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">
            {hasProfile ? 'Edit Company Profile' : 'Create Company Profile'}
          </h1>
          <p className="text-textSecondary text-sm mt-1">Configure your public business profile and customer assistant identity</p>
        </div>
        <div>
          <Link
            to="/company/dashboard"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-2.5 px-5 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[800px]">
        {successMsg && (
          <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <CompanyProfileForm
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          description={description}
          setDescription={setDescription}
          logoPreview={logoPreview}
          fileInputRef={fileInputRef}
          triggerFileInput={triggerFileInput}
          handleLogoChange={handleLogoChange}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/company/dashboard')}
        />
      </div>
    </div>
  );
};

export default CompanyProfilePage;
