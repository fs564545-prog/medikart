import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../slices/authSlice';
import Button from '../components/Button';

const Login = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { userInfo, loading, error } = useSelector((s) => s.auth);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  // Clear error when unmounting
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    dispatch(loginUser({ email: email.trim(), password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary-purple to-accent-purple" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold title-font mb-2">Welcome Back</h1>
              <p className="text-text-secondary text-sm">Sign in to your Medico account</p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 mb-6 text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text-secondary">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary-purple hover:text-accent-purple transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full py-3 mt-2 text-sm sm:text-base"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-text-secondary">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@medico.com');
                  setPassword('admin1234');
                  dispatch(loginUser({ email: 'admin@medico.com', password: 'admin1234' }));
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary-purple/10 border border-primary-purple/20 hover:bg-primary-purple/20 transition-all group"
              >
                <span className="text-xs font-semibold text-primary-purple group-hover:text-white">Admin</span>
                <span className="text-[10px] text-text-secondary">Quick Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@medico.com');
                  setPassword('demo1234');
                  dispatch(loginUser({ email: 'demo@medico.com', password: 'demo1234' }));
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20 hover:bg-accent-purple/20 transition-all group"
              >
                <span className="text-xs font-semibold text-accent-purple group-hover:text-white">User</span>
                <span className="text-[10px] text-text-secondary">Quick Login</span>
              </button>
            </div>

            {/* Demo login hint */}
            <div className="bg-card-bg/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-text-secondary text-center mb-6">
              Demo: <span className="text-accent-purple font-medium">demo@medico.com</span> / <span className="text-accent-purple font-medium">demo1234</span>
            </div>

            {/* Footer link */}
            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-purple hover:text-accent-purple font-medium transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
