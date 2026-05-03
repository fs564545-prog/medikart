import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  updateQty,
  clearCartItems,
  selectCartSubtotal,
} from '../slices/cartSlice';

const SHIPPING_RATE  = 5.00;
const FREE_SHIPPING  = 50;           // free above $50
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80';

const Cart = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);
  const items      = useSelector((s) => s.cart.cartItems);
  const subtotal   = useSelector(selectCartSubtotal);
  const shipping   = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_RATE;
  const total      = subtotal + shipping;

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  /* ── Empty State ──────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center py-16 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <ShoppingBag size={72} className="text-white/10 mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-bold text-text-secondary">Your cart is empty</h2>
        <p className="text-text-secondary text-sm max-w-xs">
          Browse our collection and add some medicines to your cart.
        </p>
        <Button variant="primary" onClick={() => navigate('/medicines')} className="mt-2">
          <ArrowLeft size={16} /> Browse Medicines
        </Button>
      </div>
    );
  }

  /* ── Cart with items ──────────────────────────────────────────────────── */
  return (
    <div className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Shopping Cart{' '}
          <span className="text-sm font-normal text-text-secondary ml-2">
            ({items.length} item{items.length !== 1 ? 's' : ''})
          </span>
        </h1>
        <button
          onClick={() => dispatch(clearCartItems())}
          className="text-xs text-error hover:text-red-400 transition-colors flex items-center gap-1.5 border border-error/30 hover:border-error/60 px-3 py-1.5 rounded-lg"
        >
          <Trash2 size={12} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* ── Item List ── */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => {
              const uid   = item.id ?? item._id;
              const image = item.image || item.imageUrl || FALLBACK_IMAGE;

              return (
                <motion.div
                  key={uid}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4 rounded-2xl border border-white/8 flex flex-col xs:flex-row items-center gap-4 hover:border-white/15 transition-colors"
                >
                  {/* Image */}
                  <Link to={`/medicine/${uid}`} className="flex-shrink-0">
                    <img
                      src={image}
                      alt={item.name}
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-900"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center xs:text-left">
                    <Link
                      to={`/medicine/${uid}`}
                      className="font-semibold text-sm sm:text-base hover:text-accent-purple transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.brand && (
                      <p className="text-xs text-text-secondary mt-0.5">{item.brand}</p>
                    )}
                    <p className="text-lg font-bold text-white mt-1">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Qty Controls + Remove */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-1 bg-dark-bg border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          item.qty <= 1
                            ? dispatch(removeFromCart(uid))
                            : dispatch(updateQty({ id: uid, qty: item.qty - 1 }))
                        }
                        className="px-2.5 py-2 hover:bg-white/10 transition-colors text-text-secondary hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-2 text-sm font-bold min-w-[2rem] text-center">
                        {item.qty ?? 1}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(updateQty({ id: uid, qty: (item.qty ?? 1) + 1 }))
                        }
                        className="px-2.5 py-2 hover:bg-white/10 transition-colors text-text-secondary hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-semibold text-accent-purple min-w-[3rem] text-right hidden sm:block">
                      ${(item.price * (item.qty ?? 1)).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => dispatch(removeFromCart(uid))}
                      className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Continue shopping */}
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mt-2"
          >
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        {/* ── Order Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl border border-white/10 p-5 sm:p-6 h-fit lg:sticky lg:top-20"
        >
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          <div className="space-y-3 text-sm mb-5 border-b border-white/10 pb-5">
            {/* Items breakdown */}
            {items.map((item) => (
              <div key={item.id ?? item._id} className="flex justify-between items-start gap-2">
                <span className="text-text-secondary line-clamp-1 flex-1">{item.name}</span>
                <span className="text-white flex-shrink-0">
                  {item.qty ?? 1} × ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm mb-5 border-b border-white/10 pb-5">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Shipping</span>
              <span className={shipping === 0 ? 'text-success font-medium' : 'text-white'}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {subtotal < FREE_SHIPPING && (
              <p className="text-xs text-text-secondary bg-primary-purple/10 border border-primary-purple/20 rounded-lg px-3 py-2">
                Add <span className="text-accent-purple font-medium">${(FREE_SHIPPING - subtotal).toFixed(2)}</span> more for free shipping!
              </p>
            )}
          </div>

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span className="text-primary-purple">${total.toFixed(2)}</span>
          </div>

          <Button
            variant="primary"
            onClick={handleCheckout}
            className="w-full py-3 text-sm sm:text-base"
          >
            {userInfo ? (
              <><ArrowRight size={18} /> Proceed to Checkout</>
            ) : (
              <><ArrowRight size={18} /> Login to Checkout</>
            )}
          </Button>

          {!userInfo && (
            <p className="text-xs text-center text-text-secondary mt-3">
              <Link to="/login" className="text-primary-purple hover:text-accent-purple">Sign in</Link> to save your cart
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
