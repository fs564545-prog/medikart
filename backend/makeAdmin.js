import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email: node makeAdmin.js <email>');
  process.exit(1);
}

const promoteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`✅ Success: User ${email} is now an ADMIN.`);
    } else {
      console.log(`❌ Error: User with email ${email} not found.`);
    }
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

promoteUser();
