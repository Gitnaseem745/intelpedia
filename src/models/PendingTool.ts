import mongoose from 'mongoose';

interface Feature {
  name: string;
  details: string;
}

interface PendingToolDocument extends mongoose.Document {
  title: string;
  description: string;
  tags: string[];
  siteUrl: string;
  imgUrl?: string;
  features?: Feature[];
  featured?: boolean;
  isFree?: boolean;
  pricing?: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const featuresSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true }
}, {
  _id: false
});

const pendingToolSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  siteUrl: { type: String, required: true },
  imgUrl: { type: String, required: false },
  features: { type: [featuresSchema] },
  featured: { type: Boolean, default: false },
  isFree: { type: Boolean, default: undefined },
  pricing: { type: Number, default: undefined, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'pending-tools'
});

const PendingTool = mongoose.models.PendingTool || mongoose.model<PendingToolDocument>('PendingTool', pendingToolSchema);

export default PendingTool;
export type { PendingToolDocument, Feature };
