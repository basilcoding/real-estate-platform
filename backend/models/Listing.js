import { Schema, model } from 'mongoose';

const listingSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  
  // 👇 Modified price and added isNegotiable
  price: { 
    type: Number, 
    min: 0,
    required: function() { return !this.isNegotiable; } // Only required if NOT negotiable
  },
  isNegotiable: { type: Boolean, default: false },
  
  propertyType: { type: String, enum: ["House", "Apartment", "Commercial", "Land"], required: true },
  status: { type: String, enum: ["Available", "Sold", "Rented"], default: "Available" },
  address: { type: String, required: true, trim: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

export default model('Listing', listingSchema);