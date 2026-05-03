import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useToast } from './Toast';
import Button from './Button';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [imgSrc, setImgSrc] = useState(product.image || product.imageUrl || FALLBACK_IMAGE);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
    setAdded(true);
    addToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 1800);
  };

  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;
  const rating = product.rating ?? 0;
  const numReviews = product.numReviews ?? 0;
  const productId = product.id || product._id || '1';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-card-bg/70 backdrop-blur-md rounded-xl overflow-hidden shadow-lg flex flex-col h-full border border-white/5 group hover:border-primary-purple/40 hover:shadow-primary-purple/10 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <Link to={`/medicine/${productId}`} className="relative block h-44 sm:h-48 bg-gray-900 overflow-hidden flex-shrink-0">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        {/* Brand Badge */}
        <div className="absolute top-2 right-2 bg-dark-bg/80 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-md text-accent-purple border border-primary-purple/30">
          {product.brand}
        </div>
        {/* Category badge */}
        {product.category && (
          <div className="absolute bottom-2 left-2 bg-dark-bg/80 backdrop-blur-sm text-[10px] font-medium px-2 py-0.5 rounded-full text-text-secondary border border-white/10">
            {product.category}
          </div>
        )}
        {/* Top Rated Badge */}
        {rating >= 4.5 && (
          <div className="absolute top-2 left-2 bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1">
            <FaStar size={8} /> TOP RATED
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link to={`/medicine/${productId}`}>
          <h3 className="text-sm sm:text-base font-bold line-clamp-2 hover:text-accent-purple transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <FaStar size={11} className="text-yellow-400 flex-shrink-0" />
          <span>
            {Number(rating).toFixed(1)} ({numReviews} reviews)
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-white">
            ${price}
          </span>
          <Button
            variant="primary"
            className="!px-3 !py-2 !rounded-lg text-sm"
            title="Add to Cart"
            onClick={handleAddToCart}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <FaCheck size={12} />
                  <span className="hidden sm:inline text-xs">Added!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <FaShoppingCart size={14} />
                  <span className="hidden sm:inline text-xs">Add</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
