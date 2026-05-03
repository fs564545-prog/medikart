import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Package, Loader2, AlertCircle } from 'lucide-react';
import { fetchMedicineById, clearSelectedMedicine } from '../slices/medicineSlice';
import { addToCart } from '../slices/cartSlice';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedMedicine: med, loading, error } = useSelector((s) => s.medicines);
  const { items: medicines } = useSelector((s) => s.medicines);
  const { addToast } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchMedicineById(id));
    return () => dispatch(clearSelectedMedicine());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...med, qty }));
    setAdded(true);
    addToast(`${med.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = medicines
    .filter(m => m.category === med?.category && m._id !== med?._id)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="text-primary-purple animate-spin" />
        <p className="text-text-secondary animate-pulse">Fetching details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle size={64} className="text-error opacity-20" />
        <h2 className="text-2xl font-bold text-error">Error Loading Medicine</h2>
        <p className="text-text-secondary max-w-md">{error}</p>
        <Link to="/medicines">
          <Button variant="secondary">Back to Medicines</Button>
        </Link>
      </div>
    );
  }

  if (!med) return null;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(med.rating || 0));

  return (
    <div className="py-6 sm:py-8">
      {/* Back */}
      <Link
        to="/medicines"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6 sm:mb-8 text-sm"
      >
        <ArrowLeft size={18} /> Back to Medicines
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16">

        {/* ── Image ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl overflow-hidden flex items-center justify-center min-h-[280px] sm:min-h-[400px] relative shadow-2xl"
        >
          <img
            src={med.image || med.imageUrl || FALLBACK_IMAGE}
            alt={med.name}
            className="w-full h-full object-cover max-h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent" />
          {/* Category pill */}
          <span className="absolute top-4 left-4 bg-primary-purple/20 border border-primary-purple/40 text-accent-purple text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            {med.category}
          </span>
        </motion.div>

        {/* ── Details ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center gap-4 sm:gap-5"
        >
          <span className="text-accent-purple font-semibold uppercase tracking-widest text-xs sm:text-sm">
            {med.brand}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{med.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {stars.map((filled, i) => (
                <Star
                  key={i}
                  size={18}
                  className={filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                />
              ))}
            </div>
            <span className="text-text-secondary text-sm">({med.numReviews || 0} customer reviews)</span>
          </div>

          {/* Price */}
          <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ${Number(med.price || 0).toFixed(2)}
          </div>

          {/* Stock */}
          <div
            className={`flex items-center gap-2 text-sm font-medium w-fit px-3 py-1.5 rounded-full ${
              med.countInStock > 0
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-error/10 text-error border border-error/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${med.countInStock > 0 ? 'bg-success animate-pulse' : 'bg-error'}`} />
            {med.countInStock > 0 ? `In Stock (${med.countInStock} available)` : 'Out of Stock'}
          </div>

          {/* Description */}
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">{med.description}</p>

          {/* Qty + Add to Cart */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="bg-card-bg border border-white/10 rounded-xl flex items-center overflow-hidden">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 hover:bg-white/5 transition-colors text-white border-r border-white/10"
              >-</button>
              <span className="px-5 font-bold text-white min-w-[50px] text-center">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="p-3 hover:bg-white/5 transition-colors text-white border-l border-white/10"
              >+</button>
            </div>
            <Button
              variant="primary"
              disabled={med.countInStock === 0}
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3.5 text-sm sm:text-base min-w-[200px] shadow-[0_0_25px_rgba(147,51,234,0.3)]"
            >
              {added ? (
                <span className="flex items-center gap-2">✓ Added to Cart</span>
              ) : (
                <span className="flex items-center gap-2"><ShoppingBag size={20} /> Add to Cart</span>
              )}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-6 mt-4">
            {[
              { icon: <Truck size={20} className="text-accent-purple" />, text: 'Express Delivery' },
              { icon: <ShieldCheck size={20} className="text-success" />, text: 'Safe & Secure' },
              { icon: <Package size={20} className="text-yellow-400" />, text: 'Sealed Package' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-text-secondary">
                {icon} {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-primary-purple rounded-full" />
            Related Products
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Reviews Placeholder ── */}
      <section className="glass-panel p-8 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-white/5">
            <div className="text-5xl font-black mb-2">{med.rating || 0}</div>
            <div className="flex items-center gap-1 mb-2 text-yellow-400">
              {stars.map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <div className="text-sm text-text-secondary">Based on {med.numReviews || 0} reviews</div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-bold">Latest Reviews</h3>
              <Button variant="ghost" className="text-xs">Write a Review</Button>
            </div>
            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-text-secondary italic">No reviews yet for this product.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
