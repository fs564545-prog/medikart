import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, Users, ShoppingCart, Activity, Plus, Edit2, Trash2, X, Loader2, 
  ChevronRight, LayoutDashboard, Pill, UserCheck, FileText, ExternalLink 
} from 'lucide-react';
import { fetchMedicines, createMedicine, updateMedicine, deleteMedicine } from '../slices/medicineSlice';
import { fetchAllUsers, deleteUser } from '../slices/authSlice';
import { fetchAllOrders } from '../slices/orderSlice';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  // States from Redux
  const { items: medicines, loading: medLoading } = useSelector((s) => s.medicines);
  const { users, loading: userLoading } = useSelector((s) => s.auth);
  const { items: orders, loading: orderLoading } = useSelector((s) => s.orders);

  // UI States
  const [activeTab, setActiveTab] = useState('medicines'); // medicines, orders, users
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', price: '', stock: '', description: '', image: '',
  });

  useEffect(() => {
    dispatch(fetchMedicines());
    dispatch(fetchAllUsers());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleEdit = (med) => {
    setEditingId(med._id);
    setFormData({
      name: med.name, brand: med.brand, category: med.category,
      price: med.price, stock: med.countInStock || med.stock,
      description: med.description, image: med.imageUrl || med.image,
    });
    setShowModal(true);
  };

  const handleDeleteMed = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      dispatch(deleteMedicine(id));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      countInStock: Number(formData.stock),
      price: Number(formData.price),
      imageUrl: formData.image
    };

    if (editingId) {
      dispatch(updateMedicine({ id: editingId, medicineData: dataToSend }));
    } else {
      dispatch(createMedicine(dataToSend));
    }
    setShowModal(false);
    setEditingId(null);
  };

  const stats = [
    { title: "Total Products", value: medicines.length, icon: <Package size={20} />, color: "text-primary-purple" },
    { title: "Total Users", value: users?.length || 0, icon: <Users size={20} />, color: "text-accent-purple" },
    { title: "Total Orders", value: orders?.length || 0, icon: <ShoppingCart size={20} />, color: "text-success" },
    { title: "Revenue", value: `$${orders?.reduce((acc, item) => acc + (item.totalPrice || 0), 0).toFixed(0)}`, icon: <Activity size={20} />, color: "text-primary-purple" },
  ];

  const tabs = [
    { id: 'medicines', label: 'Medicines', icon: <Pill size={18} /> },
    { id: 'orders', label: 'Orders', icon: <FileText size={18} /> },
    { id: 'users', label: 'Users', icon: <UserCheck size={18} /> },
  ];

  return (
    <div className="py-6 sm:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold title-font flex items-center gap-3">
            <LayoutDashboard className="text-primary-purple" /> Admin Panel
          </h1>
          <p className="text-text-secondary text-sm mt-1">Manage your store inventory, orders and users.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline" className="text-sm">Storefront</Button>
          </Link>
          <Button 
            variant="primary" 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', brand: '', category: '', price: '', stock: '', description: '', image: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Add Medicine
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-3"
          >
            <div className={`p-2.5 w-fit rounded-xl bg-white/5 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">{stat.title}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 px-1 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? 'text-accent-purple' : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-purple" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'medicines' && (
              <motion.table 
                key="medicines"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full text-left border-collapse"
              >
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs text-text-secondary uppercase tracking-widest">
                    <th className="p-5 font-bold">Medicine</th>
                    <th className="p-5 font-bold">Category</th>
                    <th className="p-5 font-bold">Price</th>
                    <th className="p-5 font-bold">Stock</th>
                    <th className="p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {medicines.map((med) => (
                    <tr key={med._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <img src={med.imageUrl || med.image} className="w-10 h-10 rounded-lg object-cover bg-gray-800" alt="" />
                          <div>
                            <div className="font-bold text-white">{med.name}</div>
                            <div className="text-xs text-text-secondary">{med.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-2.5 py-1 rounded-full bg-primary-purple/10 text-primary-purple text-xs border border-primary-purple/20">
                          {med.category}
                        </span>
                      </td>
                      <td className="p-5 font-bold text-white">${med.price}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${med.countInStock > 10 ? 'bg-success' : 'bg-error'}`} />
                          {med.countInStock || 0} units
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(med)} 
                            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMed(med._id)} 
                            className="p-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-all border border-error/20"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}

            {activeTab === 'users' && (
              <motion.table 
                key="users"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full text-left border-collapse"
              >
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs text-text-secondary uppercase tracking-widest">
                    <th className="p-5 font-bold">User</th>
                    <th className="p-5 font-bold">Email</th>
                    <th className="p-5 font-bold">Role</th>
                    <th className="p-5 font-bold">Joined</th>
                    <th className="p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users?.map((user) => (
                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-5 font-bold text-white">{user.name}</td>
                      <td className="p-5 text-text-secondary">{user.email}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${
                          user.role === 'admin' ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/20' : 'bg-white/5 text-text-secondary border-white/10'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5 text-xs text-text-secondary">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 text-right">
                        {user.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(user._id)} className="p-2 hover:bg-error/10 text-error rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}

            {activeTab === 'orders' && (
              <motion.table 
                key="orders"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full text-left border-collapse"
              >
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs text-text-secondary uppercase tracking-widest">
                    <th className="p-5 font-bold">Order ID</th>
                    <th className="p-5 font-bold">Customer</th>
                    <th className="p-5 font-bold">Amount</th>
                    <th className="p-5 font-bold">Status</th>
                    <th className="p-5 font-bold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders?.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-5 font-mono text-xs text-accent-purple">#{order._id.slice(-8)}</td>
                      <td className="p-5">
                        <div className="font-bold text-white">{order.user?.name || 'Guest'}</div>
                        <div className="text-xs text-text-secondary">{order.user?.email || 'No email'}</div>
                      </td>
                      <td className="p-5 font-bold text-white">${order.totalPrice}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.isPaid ? 'bg-success/10 text-success border border-success/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button className="p-2 hover:bg-white/10 text-text-secondary rounded-lg transition-all"><ExternalLink size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-card-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Name</label>
                    <input 
                      type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Brand</label>
                    <input 
                      type="text" required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Category</label>
                    <input 
                      type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Price ($)</label>
                    <input 
                      type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Stock Units</label>
                    <input 
                      type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase">Image URL</label>
                    <input 
                      type="text" required value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Description</label>
                  <textarea 
                    rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-purple transition-colors"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" className="min-w-[120px]">
                    {medLoading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Update' : 'Create')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
