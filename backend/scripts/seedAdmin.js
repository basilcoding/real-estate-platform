import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Company Admin',
      role: 'admin',
      company: {
        name: 'Your Real Estate Company',
        phone: '+1 (555) 123-4567',
        website: 'https://yourcompany.com'
      },
      isActive: true
    });

    console.log('\n✅ Admin user created successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔐 Password: Admin@123');
    console.log('🏢 Company: Your Real Estate Company');
    console.log('⚠️  Change password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();