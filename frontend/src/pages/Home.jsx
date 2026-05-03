import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ShieldCheck, Truck, Clock, Star, Loader2 } from 'lucide-react';
import { fetchMedicines } from '../slices/medicineSlice';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

const features = [
  { icon: <Truck size={24} />, title: 'Fast Delivery', desc: 'Get medicines at your door within hours' },
  { icon: <ShieldCheck size={24} />, title: '100% Genuine', desc: 'Certified authentic products only' },
  { icon: <Clock size={24} />, title: '24/7 Support', desc: 'Expert help available around the clock' },
  { icon: <Star size={24} />, title: 'Top Rated', desc: 'Trusted by 50,000+ happy customers' },
];

const FadeInView = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { items: medicines, loading } = useSelector((s) => s.medicines);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch if we don't have medicines already
    if (medicines.length === 0) {
      dispatch(fetchMedicines());
    }
  }, [dispatch, medicines.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('keyword', searchTerm.trim());
    if (category) params.set('category', category);
    navigate(`/medicines?${params.toString()}`);
  };

  // Get first 4 medicines as featured
  const featuredMedicines = medicines.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-8 sm:py-12 overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 min-h-[50vh]">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-primary-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Your Health,{' '}
            <span className="block mt-2 bg-gradient-to-r from-primary-purple to-accent-purple bg-clip-text text-transparent title-font">
              Delivered Today
            </span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto md:mx-0 leading-relaxed">
            Get premium, specialized medicines fast. We guarantee safe, reliable, and swift delivery right to your doorstep anywhere in the country.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button
              variant="primary"
              className="flex items-center gap-2 text-sm sm:text-base"
              onClick={() => navigate('/medicines')}
            >
              Shop Now <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" className="text-sm sm:text-base">
              View Offers
            </Button>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex-1 w-full"
        >
          <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-square rounded-2xl bg-gradient-to-tr from-card-bg to-gray-800 border border-white/10 shadow-2xl relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80"
              alt="Medicine showcase"
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 right-6 glass-panel px-3 py-2 rounded-xl border border-white/10"
            >
              <span className="text-success font-semibold flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                In Stock
              </span>
            </motion.div>

            {/* Stats badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-6 left-6 glass-panel px-3 py-2 rounded-xl border border-white/10"
            >
              <p className="text-xs text-text-secondary">Happy Customers</p>
              <p className="text-white font-bold text-sm">50,000+</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Search Bar ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <form
          onSubmit={handleSearch}
          className="glass-panel p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border border-white/10 shadow-xl"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search for medicines, vitamins, supplements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card-bg border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors text-sm sm:text-base"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-card-bg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-purple w-full sm:w-44 text-sm sm:text-base appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="vitamins">Vitamins</option>
            <option value="painkillers">Painkillers</option>
            <option value="supplements">Supplements</option>
            <option value="antibiotics">Antibiotics</option>
          </select>

          <Button type="submit" variant="primary" className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base">
            <Search size={16} /> Search
          </Button>
        </form>
      </motion.section>

      {/* ── Features ── */}
      <FadeInView>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 flex flex-col gap-3 text-center hover:border-primary-purple/30 hover:bg-white/5 transition-all duration-300"
            >
              <div className="text-primary-purple mx-auto bg-primary-purple/10 p-3 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.2)]">{icon}</div>
              <h3 className="text-sm sm:text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed hidden sm:block">{desc}</p>
            </motion.div>
          ))}
        </div>
      </FadeInView>

      {/* ── Featured Medicines ── */}
      <section>
        <FadeInView>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-4xl font-black title-font">
              Featured <span className="text-primary-purple">Selection</span>
            </h2>
            <Button
              variant="ghost"
              className="text-xs sm:text-sm !px-4 !py-2 group"
              onClick={() => navigate('/medicines')}
            >
              Explore All <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </FadeInView>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-purple" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {featuredMedicines.map((med, i) => (
              <FadeInView key={med._id || med.id} delay={i * 0.1}>
                <ProductCard product={med} />
              </FadeInView>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
