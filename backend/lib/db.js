import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // 👇 Protects against NoSQL injection at the database layer globally
    mongoose.set('sanitizeFilter', true); 
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};