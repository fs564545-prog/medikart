import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../slices/authSlice';
import Button from '../components/Button';

const Register = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { userInfo, loading, error } = useSelector((s) => s.auth);

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [formErr,  setFormErr]  = useState('');

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  // Password strength
  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-error', 'bg-yellow-500', 'bg-yellow-400', 'bg-success'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErr('');
    if (!name.trim()) return setFormErr('Please enter your full name.');
    if (!email.trim()) return setFormErr('Please enter your email address.');
    if (password.length < 6) return setFormErr('Password must be at least 6 characters.');
    if (password !== confirm) return setFormErr('Passwords do not match.');
    dispatch(registerUser({ name: name.trim(), email: email.trim(), password }));
  };

  const displayErr = formErr || error;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary-purple via-accent-purple to-success" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold title-font mb-2">Create Account</h1>
              <p className="text-text-secondary text-sm">Join Medico — your health partner</p>
            </div>

            {/* Error */}
            {displayErr && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 mb-5 text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{displayErr}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            strength >= lvl ? strengthColor[strength] : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary">
                      Strength:{' '}
                      <span className={strength >= 3 ? 'text-success' : strength >= 2 ? 'text-yellow-400' : 'text-error'}>
                        {strengthLabel[strength]}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-dark-bg border rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-text-secondary focus:outline-none transition-colors ${
                      confirm && confirm !== password
                        ? 'border-error focus:border-error'
                        : 'border-white/10 focus:border-primary-purple'
                    }`}
                  />
                  {confirm && confirm === password && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-success" size={16} />
                  )}
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
                  <><Loader2 size={18} className="animate-spin" /> Creating account...</>
                ) : (
                  <><UserPlus size={18} /> Create Account</>
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-text-secondary mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-purple hover:text-accent-purple font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
