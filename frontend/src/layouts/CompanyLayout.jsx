import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, Settings, LogOut, ShieldAlert, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const CompanyLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'CO';
  };

  return (
    <div className="flex min-h-screen bg-bgBase bg-[radial-gradient(at_0%_0%,rgba(59,130,246,0.07)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(139,92,246,0.07)_0px,transparent_50%)]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-bgSurface border-r border-borderColor flex flex-col flex-shrink-0 h-screen sticky top-0 z-10">
        <div className="p-6 text-lg font-extrabold border-b border-borderColor flex items-center gap-2">
          <ShieldAlert className="text-primary" size={24} />
          <span className="text-textPrimary font-sans">
            OmniSupport <span className="text-primary text-[11px] font-bold">COMPANY</span>
          </span>
        </div>

        <nav className="py-4 px-3 flex flex-col gap-1 flex-grow overflow-y-auto">
          <NavLink 
            to="/company/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/company/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <Settings size={18} />
            <span>Company Profile</span>
          </NavLink>

          <NavLink 
            to="/company/documents" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <FileText size={18} />
            <span>Manage Documents</span>
          </NavLink>

          <NavLink 
            to="/company/analytics" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <BarChart3 size={18} />
            <span>Analytics Dashboard</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-borderColor flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[13px]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accentPurple flex items-center justify-center font-bold text-white text-[13px]">
              {getInitials(user?.email || '')}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-textPrimary text-ellipsis overflow-hidden white-space-nowrap">
                {user?.email}
              </span>
              <span className="text-textMuted text-[11px]">Company Owner</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 font-semibold text-sm py-2.5 px-6 rounded-md text-textPrimary bg-bgSurfaceElevated border border-borderColor hover:bg-bgSurfaceHover w-full transition-all duration-150"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-borderColor flex items-center justify-between px-8 bg-bgBase/50 backdrop-blur-md sticky top-0 z-[9]">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-textMuted">Console</span>
            <span className="text-borderColor">/</span>
            <span className="font-semibold text-textPrimary">Management</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-textSecondary">
              Live Support Active
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-8 max-w-[1200px] w-full mx-auto flex-grow animate-[fadeIn_0.3s_ease]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CompanyLayout;
