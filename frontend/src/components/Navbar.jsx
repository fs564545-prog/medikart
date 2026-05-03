import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Menu, X, Pill, LogOut, User, LayoutDashboard, Search, ChevronRight, PlusCircle 
} from 'lucide-react';
import { logout } from '../slices/authSlice';
import Button from './Button';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/medicines', label: 'Store', exact: false },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: allMedicines } = useSelector((state) => state.medicines);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?keyword=${searchQuery.trim()}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const filteredSuggestions = searchQuery.trim().length > 1
    ? allMedicines.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 w-full ${
      isScrolled ? 'bg-dark-bg/70 backdrop-blur-3xl border-b border-white/10 py-2 shadow-2xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="bg-primary-purple p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(147,51,234,0.4)]">
            <PlusCircle className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter title-font bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            MEDICO
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-md relative group mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-purple transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-bg border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple/30 transition-all"
            />
          </form>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              >
                {filteredSuggestions.map((med) => (
                  <Link
                    key={med._id}
                    to={`/medicine/${med._id}`}
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <img src={med.imageUrl || med.image} className="w-10 h-10 rounded-lg object-cover bg-gray-800" alt="" />
                    <div>
                      <div className="text-xs font-bold text-white">{med.name}</div>
                      <div className="text-[10px] text-text-secondary">{med.brand}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-text-secondary" />
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink 
                key={to} 
                to={to} 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary-purple' : 'text-text-secondary hover:text-white'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          
          <Link to="/cart" className="relative group p-1">
            <motion.div
              key={cartCount}
              animate={cartCount > 0 ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <ShoppingCart className="text-text-secondary group-hover:text-primary-purple transition-colors" size={22} />
            </motion.div>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-primary-purple text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-dark-bg"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              {userInfo.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-xs font-bold text-accent-purple hover:bg-accent-purple/10 px-3 py-1.5 rounded-full transition-colors border border-accent-purple/20">
                  <LayoutDashboard size={14} /> Admin
                </Link>
              )}
              <div className="flex items-center gap-3 group cursor-pointer relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-purple to-accent-purple flex items-center justify-center text-sm font-bold text-white shadow-lg border-2 border-white/10">
                  {userInfo.name.charAt(0)}
                </div>
                <button onClick={handleLogout} className="text-text-secondary hover:text-error transition-colors p-2 rounded-lg hover:bg-white/5">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="!px-4 !py-2 text-sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="!px-6 !py-2 text-sm shadow-[0_0_20px_rgba(147,51,234,0.3)]">Join</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-text-secondary hover:text-white transition-colors">
            <Search size={22} />
          </button>
          <Link to="/cart" className="relative p-2 text-text-secondary hover:text-white transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="absolute top-1.5 right-1.5 bg-primary-purple w-2.5 h-2.5 rounded-full border-2 border-dark-bg" />}
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white ml-1">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-card-bg/95 backdrop-blur-xl border-b border-white/5 p-4"
          >
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                autoFocus
                placeholder="Search for medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-purple"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-dark-bg/98 backdrop-blur-2xl flex flex-col p-8 pt-28 gap-8 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-3xl font-bold flex items-center justify-between group">
                Home <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/medicines" onClick={() => setIsOpen(false)} className="text-3xl font-bold flex items-center justify-between group">
                Store <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {userInfo?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-accent-purple flex items-center justify-between group">
                  Admin Panel <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
            
            <div className="mt-auto flex flex-col gap-4">
              {userInfo ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-primary-purple flex items-center justify-center text-lg font-bold">{userInfo.name.charAt(0)}</div>
                    <div>
                      <div className="font-bold">{userInfo.name}</div>
                      <div className="text-xs text-text-secondary">{userInfo.email}</div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="w-full py-4 text-error border-error/20 flex items-center justify-center gap-2">
                    <LogOut size={18} /> Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full py-4">Login</Button></Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}><Button variant="primary" className="w-full py-4 shadow-lg shadow-primary-purple/20">Create Account</Button></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
