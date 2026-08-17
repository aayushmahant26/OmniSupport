import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import { CompanyLayout } from '../layouts/CompanyLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';

// Pages - Auth
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Pages - Company
import { CompanyDashboard } from '../pages/company/CompanyDashboard';
import { CompanyProfilePage } from '../pages/company/CompanyProfilePage';
import { UploadDocumentPage } from '../pages/company/UploadDocumentPage';
import { CompanyAnalyticsPage } from '../pages/company/CompanyAnalyticsPage';

// Pages - Customer
import { CompanyListPage } from '../pages/customer/CompanyListPage';
import { CompanyChatPage } from '../pages/customer/CompanyChatPage';
import { ComparisonPage } from '../pages/customer/ComparisonPage';
import { FavoritesPage } from '../pages/customer/FavoritesPage';

// Route Guards
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'hsl(var(--bg-base))',
        color: 'hsl(var(--text-secondary))'
      }}>
        <div className="typing-indicator">
          <div className="typing-dot" style={{ width: '12px', height: '12px' }}></div>
          <div className="typing-dot" style={{ width: '12px', height: '12px' }}></div>
          <div className="typing-dot" style={{ width: '12px', height: '12px' }}></div>
        </div>
        <span>Verifying secure session...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If user tries to access company page but is a customer
    if (user.role === 'customer') {
      return <Navigate to="/customer/companies" replace />;
    }
    // If user tries to access customer page but is a company
    if (user.role === 'company') {
      return <Navigate to="/company/dashboard" replace />;
    }
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // Let the boot loader handle it
  }

  if (isAuthenticated && user) {
    if (user.role === 'company') {
      return <Navigate to="/company/dashboard" replace />;
    }
    if (user.role === 'customer') {
      return <Navigate to="/customer/companies" replace />;
    }
  }

  return children;
};

export const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Root redirect logic
  const getRootRedirect = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    return user.role === 'company' 
      ? <Navigate to="/company/dashboard" replace /> 
      : <Navigate to="/customer/companies" replace />;
  };

  return (
    <Routes>
      {/* Root Path redirect */}
      <Route path="/" element={getRootRedirect()} />

      {/* Public Auth Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Company Protected Routes */}
      <Route path="/company" element={
        <ProtectedRoute requiredRole="company">
          <CompanyLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="profile" element={<CompanyProfilePage />} />
        <Route path="documents" element={<UploadDocumentPage />} />
        <Route path="analytics" element={<CompanyAnalyticsPage />} />
      </Route>

      {/* Customer Protected Routes */}
      <Route path="/customer" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="companies" replace />} />
        <Route path="companies" element={<CompanyListPage />} />
        <Route path="chat" element={<CompanyChatPage />} />
        <Route path="chat/:sessionId" element={<CompanyChatPage />} />
        <Route path="compare" element={<ComparisonPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={getRootRedirect()} />
    </Routes>
  );
};

export default AppRoutes;
