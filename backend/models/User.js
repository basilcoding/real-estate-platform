import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' }, // Only admins for single company
  company: {
    name: { type: String, default: 'Your Company Name' },
    phone: { type: String },
    website: { type: String },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default model('User', userSchema);