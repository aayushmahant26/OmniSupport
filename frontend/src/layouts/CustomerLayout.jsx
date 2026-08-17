import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, MessageSquareCode, GitCompare, LogOut, Bot, Heart } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'CU';
  };

  return (
    <div className="flex min-h-screen bg-bgBase bg-[radial-gradient(at_0%_0%,rgba(59,130,246,0.07)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(139,92,246,0.07)_0px,transparent_50%)]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-bgSurface border-r border-borderColor flex flex-col flex-shrink-0 h-screen sticky top-0 z-10">
        <div className="p-6 text-lg font-extrabold border-b border-borderColor flex items-center gap-2">
          <Bot className="text-primary" size={24} />
          <span className="text-textPrimary font-sans">
            OmniSupport <span className="text-primary text-[11px] font-bold">CUSTOMER</span>
          </span>
        </div>

        <nav className="py-4 px-3 flex flex-col gap-1 flex-grow overflow-y-auto">
          <NavLink 
            to="/customer/companies" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <Building2 size={18} />
            <span>Browse Companies</span>
          </NavLink>

          <NavLink 
            to="/customer/chat" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <MessageSquareCode size={18} />
            <span>AI Customer Support</span>
          </NavLink>

          <NavLink 
            to="/customer/compare" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <GitCompare size={18} />
            <span>Compare Policies</span>
          </NavLink>

          <NavLink 
            to="/customer/favorites" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'text-textPrimary bg-primary/10 border-l-[3px] border-primary' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceElevated'
              }`
            }
          >
            <Heart size={18} />
            <span>Favorite Companies</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-borderColor flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[13px]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accentPurple to-primary flex items-center justify-center font-bold text-white text-[13px]">
              {getInitials(user?.email || '')}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-textPrimary text-ellipsis overflow-hidden white-space-nowrap">
                {user?.email}
              </span>
              <span className="text-textMuted text-[11px]">Customer Account</span>
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
            <span className="text-textMuted">Client</span>
            <span className="text-borderColor">/</span>
            <span className="font-semibold text-textPrimary">Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-textSecondary">
              RAG Pipeline Enabled
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-8 max-w-[1200px] w-full mx-auto flex-grow flex flex-col animate-[fadeIn_0.3s_ease]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;
