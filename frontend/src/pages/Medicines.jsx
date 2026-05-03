import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronUp, Frown, Loader2, AlertCircle } from 'lucide-react';
import { fetchMedicines } from '../slices/medicineSlice';
import ProductCard from '../components/ProductCard';
import MedicineSkeleton from '../components/MedicineSkeleton';
import Button from '../components/Button';

// ── Categories & Brands (Dynamic based on data) ─────────
const CATEGORIES = ['Pain Relief', 'Cold & Flu', 'Antibiotics', 'Pediatric'];
const BRANDS = ['GSK', 'Abbott', 'Reckitt', 'Pfizer'];
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest Arrivals' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Best Rating' },
];

const Medicines = () => {
  const dispatch = useDispatch();
  const { items: medicines, loading, error } = useSelector((s) => s.medicines);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Local input state
  const [inputValue, setInputValue] = useState(searchParams.get('keyword') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const kw = searchParams.get('keyword') || '';
    setInputValue(kw);
    const params = Object.fromEntries([...searchParams]);
    dispatch(fetchMedicines(params));
  }, [searchParams, dispatch]);

  const activeKeyword = searchParams.get('keyword') || '';

  // Apply local filters and SORTING
  const filtered = useMemo(() => {
    let result = [...medicines].filter((med) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(med.category);

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(med.brand);

      const matchesMin = !minPrice || med.price >= Number(minPrice);
      const matchesMax = !maxPrice || med.price <= Number(maxPrice);

      return matchesCategory && matchesBrand && matchesMin && matchesMax;
    });

    // Apply Sorting
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    return result;
  }, [medicines, selectedCategories, selectedBrands, minPrice, maxPrice, sortBy]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      params.set('keyword', inputValue.trim());
    } else {
      params.delete('keyword');
    }
    
    // Add Price Range to URL
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    setSearchParams(params);
  };

  // Clear all filters
  const clearAll = () => {
    setInputValue('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleBrand = (b) =>
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const hasActiveFilters =
    activeKeyword || selectedCategories.length || selectedBrands.length || minPrice || maxPrice;

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full md:w-60 lg:w-64 flex-shrink-0"
    >
      <div className="glass-panel p-5 rounded-2xl border border-white/10 sticky top-20">
        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Filter size={18} className="text-primary-purple" /> Filters
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-error hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Clear All
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4 rounded border-white/20 bg-dark-bg accent-primary-purple cursor-pointer"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
            Brands
          </h3>
          <div className="space-y-2">
            {BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-white/20 bg-dark-bg accent-primary-purple cursor-pointer"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
            Price Range ($)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-primary-purple"
            />
            <span className="text-text-secondary text-sm">–</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-primary-purple"
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );

  // ── Main Render ───────────────────────────────────────────────────────────
  return (
    <div className="py-6 sm:py-8">

      {/* Page Header & Sort */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">All Medicines</h1>
          <p className="text-text-secondary text-sm">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            {activeKeyword && (
              <span className="ml-1">
                for "<span className="text-accent-purple font-bold">{activeKeyword}</span>"
              </span>
            )}
          </p>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card-bg border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-purple transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-5"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Search medicines, brands, categories..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-card-bg border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-text-secondary focus:outline-none focus:border-primary-purple transition-colors"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(''); setSearchParams({}); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary" className="!px-4 !py-2.5 text-sm flex-shrink-0">
          <Search size={15} /> Search
        </Button>
        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-1.5 bg-card-bg border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:text-white hover:border-primary-purple transition-all flex-shrink-0"
        >
          <Filter size={15} />
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </form>

      {/* Active filters chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {activeKeyword && (
            <span className="flex items-center gap-1 bg-primary-purple/20 text-accent-purple text-xs px-3 py-1 rounded-full border border-primary-purple/30">
              "{activeKeyword}"
              <button onClick={() => { setInputValue(''); setSearchParams({}); }}>
                <X size={11} />
              </button>
            </span>
          )}
          {selectedCategories.map((c) => (
            <span key={c} className="flex items-center gap-1 bg-white/10 text-xs px-3 py-1 rounded-full border border-white/15">
              {c} <button onClick={() => toggleCategory(c)}><X size={11} /></button>
            </span>
          ))}
          {selectedBrands.map((b) => (
            <span key={b} className="flex items-center gap-1 bg-white/10 text-xs px-3 py-1 rounded-full border border-white/15">
              {b} <button onClick={() => toggleBrand(b)}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Mobile Sidebar (collapsible) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden mb-4"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout: sidebar (desktop) + products */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8">

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <MedicineSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <AlertCircle size={48} className="text-error opacity-40" />
                <h3 className="text-xl font-semibold text-error">Connection Error</h3>
                <p className="text-sm text-text-secondary max-w-xs">{error}</p>
                <Button variant="secondary" onClick={() => dispatch(fetchMedicines())}>Try Again</Button>
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4 text-center"
              >
                <Frown size={48} className="text-text-secondary opacity-40" />
                <h3 className="text-xl font-semibold text-text-secondary">No medicines found</h3>
                <p className="text-sm text-text-secondary max-w-xs">
                  Try a different keyword or remove some filters.
                </p>
                <Button variant="secondary" onClick={clearAll}>Clear Filters</Button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product._id || product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
