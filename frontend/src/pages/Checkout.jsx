import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const Checkout = () => {
  const navigate = useNavigate();
  const [isPlaced, setIsPlaced] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsPlaced(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (isPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <CheckCircle size={80} className="text-success" />
        </motion.div>
        <h2 className="text-3xl font-bold title-font">Order Placed Successfully!</h2>
        <p className="text-text-secondary">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 title-font">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary">Full Name</label>
                <input type="text" className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-primary-purple outline-none" required />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Address</label>
                <input type="text" className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-primary-purple outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-text-secondary">City</label>
                  <input type="text" className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-primary-purple outline-none" required />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Postal Code</label>
                  <input type="text" className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-primary-purple outline-none" required />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="glass-panel p-6 rounded-xl border border-white/10 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 text-text-secondary mb-6 border-b border-white/10 pb-6">
              <div className="flex justify-between">
                <span>Paracetamol 500mg (x2)</span>
                <span className="text-white">$25.98</span>
              </div>
              <div className="flex justify-between">
                <span>Vitamin C 1000mg (x1)</span>
                <span className="text-white">$24.50</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/5">
                <span>Subtotal</span>
                <span className="text-white">$50.48</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">$5.00</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-white mb-8">
              <span>Total:</span>
              <span className="text-primary-purple bg-clip-text">$55.48</span>
            </div>
            <Button variant="primary" className="w-full py-3" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
