import mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true, max: 300 },
  reviewer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  productName: { type: String, required: true, max: 100 }
});

export default mongoose.model('Review', reviewSchema);
