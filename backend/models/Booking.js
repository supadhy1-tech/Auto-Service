import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String, require:true },
  status: { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' }
}, { timestamps: true });

BookingSchema.index({ date: 1, time: 1 }, { unique: true });


export default mongoose.model('Booking', BookingSchema);
