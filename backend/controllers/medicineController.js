import Medicine from '../models/Medicine.js';

// Global in-memory store for medicines (Mock Mode)
let globalDummyMedicines = [
  { _id: '1', name: 'Panadol Advance', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop', brand: 'GSK', category: 'Pain Relief', description: 'Panadol Advance 500mg tablets...', price: 150, countInStock: 20, rating: 4.5, numReviews: 12 },
  { _id: '2', name: 'Arinac Forte', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop', brand: 'Abbott', category: 'Cold & Flu', description: 'Used for relief of nasal congestion...', price: 240, countInStock: 15, rating: 4.8, numReviews: 8 },
  { _id: '3', name: 'Augmentin 625mg', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop', brand: 'GSK', category: 'Antibiotics', description: 'Broad-spectrum antibiotic...', price: 850, countInStock: 5, rating: 4.2, numReviews: 15 },
  { _id: '4', name: 'Brufen 400mg', image: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=2070&auto=format&fit=crop', brand: 'Abbott', category: 'Pain Relief', description: 'Used for relieving pain...', price: 180, countInStock: 40, rating: 4.6, numReviews: 10 },
  { _id: '5', name: 'Calpol Syrup', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop', brand: 'GSK', category: 'Pediatric', description: 'Effective pain relief...', price: 120, countInStock: 25, rating: 4.9, numReviews: 20 },
  { _id: '6', name: 'Disprin Regular', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop', brand: 'Reckitt', category: 'Pain Relief', description: 'Effective for headache and pain...', price: 90, countInStock: 100, rating: 4.3, numReviews: 30 },
  { _id: '7', name: 'Surbex-Z', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop', brand: 'Abbott', category: 'Pediatric', description: 'Multivitamin for energy and health...', price: 450, countInStock: 15, rating: 4.7, numReviews: 45 },
  { _id: '8', name: 'Cac-1000 Plus', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop', brand: 'GSK', category: 'Pediatric', description: 'Calcium supplement for strong bones...', price: 380, countInStock: 20, rating: 4.9, numReviews: 50 },
  { _id: '9', name: 'Flagyl 400mg', image: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=2070&auto=format&fit=crop', brand: 'Abbott', category: 'Antibiotics', description: 'Used for stomach infections...', price: 120, countInStock: 60, rating: 4.1, numReviews: 18 },
  { _id: '10', name: 'Ponstan Forte', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop', brand: 'Pfizer', category: 'Pain Relief', description: 'Fast relief for toothache and period pain...', price: 210, countInStock: 35, rating: 4.6, numReviews: 25 }
];

export const getMedicines = async (req, res) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice } = req.query;
    
    let query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Function to filter dummy data
    const getFilteredDummyData = () => {
      return globalDummyMedicines.filter(m => {
        const matchesKeyword = !keyword || m.name.toLowerCase().includes(keyword.toLowerCase());
        const matchesCategory = !category || m.category === category;
        const matchesBrand = !brand || m.brand === brand;
        const matchesMinPrice = !minPrice || m.price >= Number(minPrice);
        const matchesMaxPrice = !maxPrice || m.price <= Number(maxPrice);
        return matchesKeyword && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice;
      });
    };

    const medicines = await Medicine.find(query);
    const filteredDummy = getFilteredDummyData();

    // Merge DB results with Dummy Data (unique by _id)
    const combined = [...medicines];
    filteredDummy.forEach(d => {
      if (!combined.find(m => m._id.toString() === d._id.toString())) {
        combined.push(d);
      }
    });

    res.json({ data: combined });
  } catch (error) {
    console.error("Database error, serving filtered dummy data:", error.message);
    const { keyword, category, brand, minPrice, maxPrice } = req.query;
    const filtered = globalDummyMedicines.filter(m => {
        const matchesKeyword = !keyword || m.name.toLowerCase().includes(keyword.toLowerCase());
        const matchesCategory = !category || m.category === category;
        const matchesBrand = !brand || m.brand === brand;
        const matchesMinPrice = !minPrice || m.price >= Number(minPrice);
        const matchesMaxPrice = !maxPrice || m.price <= Number(maxPrice);
        return matchesKeyword && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice;
    });
    res.json({ data: filtered });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      res.json({ data: medicine });
    } else {
      const found = globalDummyMedicines.find(m => m._id === req.params.id);
      if (found) return res.json({ data: found });
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    console.error("Database error, serving dummy medicine:", error.message);
    const found = globalDummyMedicines.find(m => m._id === req.params.id);
    if (found) return res.json({ data: found });
    res.status(404).json({ message: 'Medicine not found' });
  }
};

export const createMedicine = async (req, res) => {
  try {
    const { name, price, description, imageUrl, brand, category, countInStock } = req.body;
    
    const medicine = new Medicine({
      name: name || 'Sample name',
      price: price || 0,
      description: description || 'Sample description',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop',
      brand: brand || 'Sample brand',
      category: category || 'Sample category',
      countInStock: countInStock || 0
    });

    const createdMedicine = await medicine.save();
    globalDummyMedicines.unshift(createdMedicine);
    res.status(201).json({ data: createdMedicine });
  } catch (error) {
    console.error("Database error while creating, serving mock response:", error.message);
    const mockCreated = {
      ...req.body,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    globalDummyMedicines.unshift(mockCreated);
    res.status(201).json({ data: mockCreated });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      Object.assign(medicine, req.body);
      const updated = await medicine.save();
      return res.json({ data: updated });
    }
    
    // Mock Update
    const index = globalDummyMedicines.findIndex(m => m._id === req.params.id);
    if (index !== -1) {
      globalDummyMedicines[index] = { ...globalDummyMedicines[index], ...req.body };
      return res.json({ data: globalDummyMedicines[index] });
    }
    res.status(404).json({ message: 'Medicine not found' });
  } catch (error) {
    console.error("Update error, mock updating:", error.message);
    const index = globalDummyMedicines.findIndex(m => m._id === req.params.id);
    if (index !== -1) {
      globalDummyMedicines[index] = { ...globalDummyMedicines[index], ...req.body };
      return res.json({ data: globalDummyMedicines[index] });
    }
    res.status(404).json({ message: 'Medicine not found' });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      await medicine.deleteOne();
      return res.json({ message: 'Medicine removed' });
    }
    
    // Mock Delete
    globalDummyMedicines = globalDummyMedicines.filter(m => m._id !== req.params.id);
    res.json({ message: 'Medicine removed (mock)' });
  } catch (error) {
    console.error("Delete error, mock removing:", error.message);
    globalDummyMedicines = globalDummyMedicines.filter(m => m._id !== req.params.id);
    res.json({ message: 'Medicine removed (mock)' });
  }
};

