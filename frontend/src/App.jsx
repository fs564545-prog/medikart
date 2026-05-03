import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <ScrollToTop />
      <div className="min-h-screen w-full bg-dark-bg text-text-primary flex flex-col">
        <Navbar />

        <main className="flex-1 w-full">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/"           element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/medicines"  element={<PageWrapper><Medicines /></PageWrapper>} />
                <Route path="/medicine/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
                <Route path="/cart"       element={<PageWrapper><Cart /></PageWrapper>} />
                <Route path="/checkout"   element={<PageWrapper><Checkout /></PageWrapper>} />
                <Route path="/login"      element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register"   element={<PageWrapper><Register /></PageWrapper>} />
                
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                </Route>
              </Routes>
            </AnimatePresence>
          </div>
        </main>

        <footer className="w-full border-t border-white/5 py-6 text-center text-text-secondary text-xs sm:text-sm mt-auto">
          <div className="max-w-[1440px] mx-auto px-4">
            © {new Date().getFullYear()} <span className="text-accent-purple font-semibold">Medico</span> — Premium Medicine Delivery. All rights reserved.
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;
