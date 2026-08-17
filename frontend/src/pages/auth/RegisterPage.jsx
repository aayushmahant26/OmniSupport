import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';

export const RegisterPage = () => {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, role);
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-bgBase bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.08)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,rgba(139,92,246,0.08)_0%,transparent_40%)] p-6 relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[440px] bg-bgSurface/70 backdrop-blur-md border border-borderColor rounded-2xl p-10 shadow-2xl animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accentPurple flex items-center justify-center font-bold text-white text-[13px]">
            <ShieldAlert size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-center mb-2 bg-gradient-to-r from-primary to-accentPurple bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-textSecondary text-center text-sm mb-8">
          Join OmniSupport AI and access automated assistance
        </p>

        {(localError || authError) && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-md text-[13px] mb-5 flex items-center gap-2">
            <span className="font-semibold">Error:</span> {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-textSecondary tracking-wide">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div 
                className={`border rounded-md py-3 text-center cursor-pointer transition-all duration-150 font-semibold text-sm ${
                  role === 'customer' 
                    ? 'border-primary bg-primary/10 text-textPrimary' 
                    : 'border-borderColor text-textSecondary hover:bg-bgSurfaceElevated'
                }`}
                onClick={() => setRole('customer')}
              >
                Customer User
              </div>
              <div 
                className={`border rounded-md py-3 text-center cursor-pointer transition-all duration-150 font-semibold text-sm ${
                  role === 'company' 
                    ? 'border-primary bg-primary/10 text-textPrimary' 
                    : 'border-borderColor text-textSecondary hover:bg-bgSurfaceElevated'
                }`}
                onClick={() => setRole('company')}
              >
                Company Owner
              </div>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail 
                size={16} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted"
              />
              <input
                id="email"
                type="email"
                className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 pl-[42px] pr-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="password">
              Password (min 6 chars)
            </label>
            <div className="relative">
              <Lock 
                size={16} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted"
              />
              <input
                id="password"
                type="password"
                className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 pl-[42px] pr-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-7 flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-textSecondary tracking-wide" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <Lock 
                size={16} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted"
              />
              <input
                id="confirmPassword"
                type="password"
                className="w-full bg-bgSurfaceElevated border border-borderColor rounded-md py-3 pl-[42px] pr-4 text-sm transition-all duration-150 focus:border-primary focus:ring-3 focus:ring-primary/15"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[46px] inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-md cursor-pointer transition-all duration-150 text-center bg-gradient-to-r from-primary to-accentPurple text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:opacity-95 hover:-translate-y-px"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-1 p-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.16s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-[typing_1.4s_infinite_ease-in-out_both_0.32s]"></div>
              </div>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[13px] text-textSecondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primaryHover font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
