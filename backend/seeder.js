import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Medicine from './models/Medicine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const medicines = [
  {
    name: 'Panadol Advance',
    brand: 'GSK',
    category: 'Pain Relief',
    description: 'Fast and effective relief of mild to moderate pain including headache, migraine, muscle ache, dysmenorrhoea, sore throat and musculoskeletal pain.',
    price: 150,
    countInStock: 50,
    rating: 4.5,
    numReviews: 12,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Arinac Forte',
    brand: 'Abbott',
    category: 'Cold & Flu',
    description: 'Used for the relief of nasal congestion and symptoms of common cold.',
    price: 240,
    countInStock: 30,
    rating: 4.8,
    numReviews: 8,
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop'
  },
  {
    name: 'Augmentin 625mg',
    brand: 'GSK',
    category: 'Antibiotics',
    description: 'Broad-spectrum antibiotic used for the treatment of various bacterial infections.',
    price: 850,
    countInStock: 20,
    rating: 4.2,
    numReviews: 15,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Brufen 400mg',
    brand: 'Abbott',
    category: 'Pain Relief',
    description: 'Used for relieving pain, helping with inflammation and reducing a high temperature.',
    price: 180,
    countInStock: 40,
    rating: 4.6,
    numReviews: 10,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Calpol Syrup',
    brand: 'GSK',
    category: 'Pediatric',
    description: 'Effective pain and fever relief for children and infants.',
    price: 120,
    countInStock: 25,
    rating: 4.9,
    numReviews: 20,
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop'
  },
  {
    name: 'Disprin Regular',
    brand: 'Reckitt',
    category: 'Pain Relief',
    description: 'Disprin is used for the treatment of mild to moderate pain and fever.',
    price: 90,
    countInStock: 100,
    rating: 4.3,
    numReviews: 30,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop'
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');
    
    await Medicine.deleteMany();
    console.log('Old medicines cleared!');
    
    await Medicine.insertMany(medicines);
    console.log('Data Imported Successfully!');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
