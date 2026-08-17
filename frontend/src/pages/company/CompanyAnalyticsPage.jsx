import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { companyApi } from '../../api/companyApi';
import { 
  Settings, 
  ShieldAlert, 
  MessageSquare, 
  Users, 
  UserCheck, 
  ThumbsUp, 
  ThumbsDown, 
  Database,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Star
} from 'lucide-react';
import { HorizontalBarChart } from './components/AnalyticsCharts';

// Skeletons
const CardSkeleton = () => (
  <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 animate-pulse flex flex-col gap-3.5 shadow-sm">
    <div className="flex justify-between items-center">
      <div className="h-4 w-24 bg-borderColor/60 rounded" />
      <div className="w-8 h-8 bg-borderColor/60 rounded-lg" />
    </div>
    <div className="h-8 w-16 bg-borderColor rounded" />
  </div>
);

const ReportSkeleton = () => (
  <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 h-[400px] animate-pulse flex flex-col gap-4 shadow-sm">
    <div className="h-4 w-40 bg-borderColor rounded" />
    <div className="h-16 w-full bg-borderColor/40 rounded-xl" />
    <div className="flex-grow flex flex-col gap-3 mt-4">
      <div className="h-4 w-full bg-borderColor/50 rounded" />
      <div className="h-4 w-5/6 bg-borderColor/50 rounded" />
      <div className="h-4 w-11/12 bg-borderColor/50 rounded" />
      <div className="h-4 w-4/5 bg-borderColor/50 rounded" />
    </div>
  </div>
);

export const CompanyAnalyticsPage = () => {
  const [company, setCompany] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState(false);
  
  // Detail Modal State
  const [detailModal, setDetailModal] = useState({ show: false, type: '', title: '', data: [] });
  
  // AI Report State
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [errorReport, setErrorReport] = useState(null);

  // Fetch Profile to verify company user setup
  const fetchProfileData = useCallback(async () => {
    try {
      const compData = await companyApi.getMyCompany();
      setCompany(compData);
      setHasProfile(true);
    } catch (err) {
      console.error('Error verifying company profile', err);
      if (err.response?.status === 404 || err.response?.data?.detail?.includes('not found')) {
        setHasProfile(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Analytics
  const fetchAnalyticsData = useCallback(async () => {
    setLoadingAnalytics(true);
    setErrorAnalytics(false);
    try {
      const data = await companyApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics', err);
      setErrorAnalytics(true);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Generate Report
  const handleGenerateReport = async () => {
    setLoadingReport(true);
    setErrorReport(null);
    try {
      const data = await companyApi.generateReport();
      setReportData(data);
    } catch (err) {
      console.error('Failed to generate AI report', err);
      setErrorReport(err.response?.data?.error || 'There was an issue contacting the analysis model. Please try again.');
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    if (hasProfile) {
      fetchAnalyticsData();
    }
  }, [hasProfile, fetchAnalyticsData]);

  if (loading) {
    return (
      <div className="p-5 flex flex-col gap-6">
        <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm h-[200px] flex items-center justify-center">
          <div className="typing-indicator flex gap-1">
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
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Analytics Dashboard</h1>
          <p className="text-textSecondary text-sm mt-1">Review AI helper metrics and user satisfaction ratings</p>
        </div>

        <div className="bg-bgSurface border border-borderColor rounded-2xl p-10 max-w-[600px] mx-auto my-10 text-center shadow-md">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 bg-warning/10 text-warning flex items-center justify-center font-bold">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-textPrimary">Profile Setup Required</h2>
          <p className="text-textSecondary mb-8 text-sm leading-relaxed">
            Please create a company profile first before checking support chat analytics.
          </p>
          <Link to="/company/profile" className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-8 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px">
            <Settings size={18} />
            <span>Create Profile Now</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Analytics Welcome Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Support Analytics</h1>
          <p className="text-textSecondary text-sm mt-1">Real-time statistics for {company?.name} chatbot interactions</p>
        </div>
        <button 
          onClick={fetchAnalyticsData}
          disabled={loadingAnalytics}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 border border-borderColor rounded-lg bg-bgSurface hover:bg-bgSurfaceElevated text-textPrimary transition-all duration-150 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={loadingAnalytics ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* Main Stats and Graphs Dashboard */}
      {loadingAnalytics ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <ReportSkeleton />
            <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 h-[300px] animate-pulse shadow-sm" />
          </div>
        </>
      ) : errorAnalytics ? (
        <div className="bg-error/5 border border-error/20 text-error p-6 rounded-2xl flex gap-3 items-center">
          <AlertCircle size={24} className="flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Failed to load analytics</h4>
            <p className="text-xs opacity-90 mt-0.5">Please check your server connection and try refreshing.</p>
          </div>
        </div>
      ) : analytics?.cards?.total_questions === 0 ? (
        <div className="bg-bgSurface border border-borderColor rounded-2xl p-10 text-center max-w-[500px] mx-auto my-8 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-textPrimary">No AI Conversations Recorded</h3>
          <p className="text-xs text-textSecondary leading-relaxed mb-6">
            When customers start asking questions to your custom AI support bot, their questions, satisfaction ratings, and topic summaries will automatically update here in real-time.
          </p>
        </div>
      ) : (
        <>
          {/* Analytics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {/* Total Favorited */}
            <div 
              onClick={() => setDetailModal({
                show: true,
                type: 'favorites',
                title: 'Customers Who Favorited Your Company',
                data: analytics.favorited_by_list
              })}
              className="bg-bgSurface border border-borderColor rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[11px] font-bold tracking-wide uppercase">Total Favorited</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform duration-200">
                  <Star size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-textPrimary">{analytics.cards.total_favorited}</div>
              <span className="text-[10px] text-textSecondary font-semibold">
                Favorited by customers
              </span>
            </div>

            {/* Total Customers */}
            <div 
              onClick={() => setDetailModal({
                show: true,
                type: 'customers',
                title: 'Unique Customers List',
                data: analytics.total_customers_list
              })}
              className="bg-bgSurface border border-borderColor rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-purple-500/30 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[11px] font-bold tracking-wide uppercase">Total Customers</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-105 transition-transform duration-200">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-textPrimary">{analytics.cards.total_customers}</div>
              <span className="text-[10px] text-textSecondary font-semibold">
                Unique customers in chat
              </span>
            </div>

            {/* Active Customers (7d) */}
            <div 
              onClick={() => setDetailModal({
                show: true,
                type: 'active_customers',
                title: 'Active Customers (Last 7 Days)',
                data: analytics.active_customers_list
              })}
              className="bg-bgSurface border border-borderColor rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-500/30 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[11px] font-bold tracking-wide uppercase">Active Customers</span>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform duration-200">
                  <UserCheck size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-textPrimary">{analytics.cards.active_customers_7d}</div>
              <span className="text-[10px] text-textSecondary font-semibold">
                Active in last 7 days
              </span>
            </div>

            {/* Helpful Responses */}
            <div 
              onClick={() => setDetailModal({
                show: true,
                type: 'helpful',
                title: 'Helpful AI Responses',
                data: analytics.helpful_list
              })}
              className="bg-bgSurface border border-borderColor rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/30 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[11px] font-bold tracking-wide uppercase">Helpful Answers</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform duration-200">
                  <ThumbsUp size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-textPrimary">{analytics.cards.helpful_responses}</div>
              <span className="text-[10px] text-success font-semibold">
                👍 Positive feedback rating
              </span>
            </div>

            {/* Unhelpful Responses */}
            <div 
              onClick={() => setDetailModal({
                show: true,
                type: 'unhelpful',
                title: 'Unhelpful AI Responses',
                data: analytics.unhelpful_list
              })}
              className="bg-bgSurface border border-borderColor rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-red-500/30 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[11px] font-bold tracking-wide uppercase">Unhelpful Answers</span>
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 group-hover:scale-105 transition-transform duration-200">
                  <ThumbsDown size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-textPrimary">{analytics.cards.unhelpful_responses}</div>
              <span className="text-[10px] text-error font-semibold">
                👎 Negative feedback rating
              </span>
            </div>

            {/* Missing Data in knowledge base */}
            <div 
              onClick={() => setDetailModal({
                show: true,
                type: 'gaps',
                title: 'Knowledge Base Gaps (Missing Data)',
                data: analytics.missing_data_list
              })}
              className="bg-bgSurface border border-borderColor rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-warning/30 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[11px] font-bold tracking-wide uppercase">Missing Data</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform duration-200">
                  <Database size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-textPrimary">{analytics.cards.missing_data}</div>
              <span className="text-[10px] text-warning font-semibold">
                Knowledge gaps identified
              </span>
            </div>
          </div>

          {/* Analysis Workspace (AI Report and Top Topics) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Left Column: AI Support Report Workspace */}
            <div className="flex flex-col gap-6">
              {loadingReport ? (
                /* Report Loading state */
                <div className="bg-bgSurface border border-borderColor rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-sm animate-pulse">
                  <Sparkles size={32} className="text-primary animate-spin mb-4" />
                  <h4 className="text-sm font-bold text-textPrimary mb-1">Analyzing Support Quality Logs</h4>
                  <p className="text-xs text-textSecondary text-center max-w-xs leading-relaxed">
                    AI is parsing conversation ratings, satisfaction patterns, and missing knowledge flags to assemble your executive recommendations report...
                  </p>
                </div>
              ) : errorReport ? (
                /* Report Error state */
                <div className="bg-error/5 border border-error/20 text-error p-6 rounded-2xl flex gap-3 items-center shadow-sm">
                  <AlertCircle size={24} className="flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Failed to generate AI report</h4>
                    <p className="text-xs opacity-90 mt-0.5 font-semibold">{errorReport}</p>
                    <button onClick={handleGenerateReport} className="mt-3 px-3.5 py-1.5 bg-error text-white text-xs font-semibold rounded-md">
                      Try Again
                    </button>
                  </div>
                </div>
              ) : reportData ? (
                /* Report Content */
                <div className="flex flex-col gap-5">
                  {/* Satisfaction score banner */}
                  <div className="p-6 rounded-2xl bg-bgSurface border border-borderColor flex items-center justify-between gap-6 shadow-sm">
                    <div>
                      <span className="text-[10px] text-textSecondary uppercase font-extrabold tracking-wide">Customer Satisfaction Rating</span>
                      <div className="text-4xl font-black text-textPrimary mt-1 flex items-baseline gap-1">
                        {reportData.satisfaction_score.toFixed(1)}%
                        <span className="text-xs text-textSecondary font-semibold">Score</span>
                      </div>
                      <p className="text-xs text-textSecondary mt-2 font-medium">
                        Based on {reportData.total_rated} ratings ({reportData.helpful_count} Helpful, {reportData.unhelpful_count} Unhelpful)
                      </p>
                    </div>
                    
                    {/* Radial score circle placeholder */}
                    <div className="w-18 h-18 rounded-full border-[5px] flex items-center justify-center relative flex-shrink-0" style={{
                      borderColor: reportData.satisfaction_score >= 80 ? '#10b981' : reportData.satisfaction_score >= 50 ? '#f59e0b' : '#ef4444',
                    }}>
                      <span className="text-xs font-black text-textPrimary">
                        {reportData.satisfaction_score >= 80 ? 'Good 😊' : reportData.satisfaction_score >= 50 ? 'Fair 😐' : 'Poor 😞'}
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendations Document */}
                  <div className="bg-bgSurface border border-borderColor rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-borderColor pb-3">
                      <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                        <Sparkles size={16} className="text-primary" />
                        AI Executive Recommendations Report
                      </h4>
                      <button
                        onClick={handleGenerateReport}
                        disabled={loadingReport}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={10} className={loadingReport ? 'animate-spin' : ''} />
                        Re-Generate
                      </button>
                    </div>
                    
                    <div className="max-h-[420px] overflow-y-auto border border-borderColor/40 bg-bgBase/40 p-5 rounded-xl whitespace-pre-wrap text-xs font-semibold text-textSecondary leading-relaxed flex flex-col gap-3 font-sans">
                      {reportData.report}
                    </div>
                  </div>
                </div>
              ) : (
                /* Report CTA */
                <div className="bg-bgSurface border border-borderColor rounded-2xl p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[350px]">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accentPurple text-white flex items-center justify-center mb-6 shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-textPrimary mb-2">AI Support Analysis Report</h3>
                  <p className="text-xs text-textSecondary leading-relaxed max-w-sm mb-6">
                    Analyze customer satisfaction logs, calculate precise satisfaction scores, and receive custom suggestions to improve your AI assistant's knowledge base.
                  </p>
                  <button
                    onClick={handleGenerateReport}
                    className="inline-flex items-center gap-2 font-semibold text-xs py-3 px-6 rounded-lg cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px"
                  >
                    Generate AI Report
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Top Topics */}
            <div className="flex flex-col gap-6">
              <HorizontalBarChart data={analytics.charts.top_topics} />
            </div>
          </div>
        </>
      )}

      {/* Dynamic Detail Modal for clicks */}
      {detailModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bgSurface border border-borderColor rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease]">
            {/* Modal Header */}
            <div className="p-6 border-b border-borderColor flex justify-between items-center bg-bgSurfaceElevated/50">
              <div>
                <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
                  <Database size={18} className="text-primary" />
                  {detailModal.title}
                </h3>
                <p className="text-xs text-textSecondary mt-0.5 font-medium">
                  Detailed analytics logs and interaction overview
                </p>
              </div>
              <button
                onClick={() => setDetailModal({ show: false, type: '', title: '', data: [] })}
                className="text-textSecondary hover:text-textPrimary text-sm font-semibold p-1.5 hover:bg-bgSurfaceElevated rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal List Content */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
              {detailModal.data.length === 0 ? (
                <div className="text-center py-10 text-textSecondary text-xs">
                  No data logs recorded for this category yet.
                </div>
              ) : (
                detailModal.data.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 rounded-xl bg-bgBase border border-borderColor flex flex-col gap-2">
                    {/* Timestamp */}
                    <div className="flex justify-between items-center text-[10px] text-textSecondary font-semibold">
                      <span>
                        {detailModal.type === 'gaps'
                          ? `Knowledge Gap #${idx + 1}`
                          : detailModal.type === 'favorites'
                          ? `Favorite Entry #${idx + 1}`
                          : detailModal.type === 'helpful'
                          ? `Resolved Query #${idx + 1}`
                          : detailModal.type === 'unhelpful'
                          ? `Unresolved Query #${idx + 1}`
                          : detailModal.type.includes('customer')
                          ? `Customer Record #${idx + 1}`
                          : `Log #${idx + 1}`}
                      </span>
                      <span>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Saved'}</span>
                    </div>

                    {/* Rendering layout based on modal type */}
                    {detailModal.type === 'favorites' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="block text-[10px] text-textSecondary">Customer Email</span>
                          <span className="font-bold text-textPrimary">{item.email}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-textSecondary">Folder Category</span>
                          <span className="font-semibold text-textPrimary capitalize">{item.category}</span>
                        </div>
                      </div>
                    )}

                    {(detailModal.type === 'customers' || detailModal.type === 'active_customers') && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="block text-[10px] text-textSecondary">Email Address</span>
                          <span className="font-bold text-textPrimary">{item.email}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-textSecondary">Total Sessions</span>
                          <span className="font-semibold text-textPrimary">{item.session_count} chats</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-textSecondary">First Contact</span>
                          <span className="text-textSecondary">{item.first_chat ? new Date(item.first_chat).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-textSecondary">Last Activity</span>
                          <span className="text-textSecondary">{item.last_chat ? new Date(item.last_chat).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    )}

                    {/* Gaps List Item: Show only the 1-2 line summary, avoiding Q&A history */}
                    {detailModal.type === 'gaps' && (
                      <div className="flex gap-2.5 items-start py-1">
                        <Database size={16} className="text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold text-textPrimary leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    )}

                    {(detailModal.type === 'helpful' || detailModal.type === 'unhelpful') && (
                      <div className="flex flex-col gap-2">
                        {/* Question */}
                        <div className="flex gap-2.5 items-start">
                          <span className="text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 flex-shrink-0">Q</span>
                          <p className="text-xs font-semibold text-textPrimary leading-relaxed">{item.question}</p>
                        </div>
                        {/* Answer */}
                        <div className="flex gap-2.5 items-start bg-bgSurface p-3 rounded-lg border border-borderColor/40">
                          <span className="text-xs font-bold text-accentPurple px-1.5 py-0.5 rounded bg-accentPurple/10 flex-shrink-0">A</span>
                          <p className="text-xs text-textSecondary leading-relaxed italic">{item.answer?.replace(/[I|l](?=\d)/g, '')}</p>
                        </div>
                        {detailModal.type === 'unhelpful' && (
                          <div className="text-[10px] font-semibold flex items-center gap-1.5 mt-1">
                            {item.feedback_missing_data ? (
                              <span className="text-warning">⚠️ Flagged as missing knowledge base data</span>
                            ) : (
                              <span className="text-textSecondary">👎 Marked unhelpful (generic reasoning)</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-borderColor bg-bgSurfaceElevated/35 flex justify-between items-center">
              <span className="text-[11px] text-textSecondary font-semibold">
                Total Logs: {detailModal.data.length}
              </span>
              <div className="flex gap-2">
                {(detailModal.type === 'unhelpful' || detailModal.type === 'gaps') && (
                  <Link
                    to="/company/documents"
                    onClick={() => setDetailModal({ show: false, type: '', title: '', data: [] })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-accentPurple hover:opacity-95 text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
                  >
                    Upload Documents to Fix Gaps
                  </Link>
                )}
                <button
                  onClick={() => setDetailModal({ show: false, type: '', title: '', data: [] })}
                  className="px-4 py-2 border border-borderColor bg-bgSurface hover:bg-bgSurfaceElevated text-textPrimary text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAnalyticsPage;
