import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all medicines (with optional filters)
export const fetchMedicines = createAsyncThunk(
  'medicines/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { keyword = '', category = '', brand = '', minPrice = '', maxPrice = '' } = params;
      const query = new URLSearchParams();
      if (keyword)  query.append('keyword', keyword);
      if (category) query.append('category', category);
      if (brand)    query.append('brand', brand);
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice) query.append('maxPrice', maxPrice);

      const { data } = await axios.get(`/api/medicines?${query.toString()}`);
      return data.data; // ApiResponse wraps payload in .data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch a single medicine by id
export const fetchMedicineById = createAsyncThunk(
  'medicines/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/medicines/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new medicine (Admin)
export const createMedicine = createAsyncThunk(
  'medicines/create',
  async (medicineData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('/api/medicines', medicineData, config);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update a medicine (Admin)
export const updateMedicine = createAsyncThunk(
  'medicines/update',
  async ({ id, medicineData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/medicines/${id}`, medicineData, config);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a medicine (Admin)
export const deleteMedicine = createAsyncThunk(
  'medicines/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(`/api/medicines/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicines',
  initialState: {
    items: [
      {
        _id: '1',
        name: 'Panadol Advance',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop',
        brand: 'GSK',
        category: 'Pain Relief',
        description: 'Panadol Advance 500mg tablets are used for fast and effective relief of mild to moderate pain.',
        price: 150,
        countInStock: 20,
        rating: 4.5,
        numReviews: 12
      },
      {
        _id: '2',
        name: 'Arinac Forte',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop',
        brand: 'Abbott',
        category: 'Cold & Flu',
        description: 'Used for relief of nasal congestion and symptoms of common cold.',
        price: 240,
        countInStock: 15,
        rating: 4.8,
        numReviews: 8
      },
      {
        _id: '3',
        name: 'Augmentin 625mg',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
        brand: 'GSK',
        category: 'Antibiotics',
        description: 'Broad-spectrum antibiotic used for various infections.',
        price: 850,
        countInStock: 5,
        rating: 4.2,
        numReviews: 15
      }
    ],
    selectedMedicine: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedMedicine: (state) => {
      state.selectedMedicine = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMedicines
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchMedicineById
    builder
      .addCase(fetchMedicineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMedicine = action.payload;
      })
      .addCase(fetchMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createMedicine
      .addCase(createMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateMedicine
      .addCase(updateMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteMedicine
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;
