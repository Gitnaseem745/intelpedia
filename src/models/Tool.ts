import mongoose from 'mongoose';

interface Feature {
  name: string;
  details: string;
}

interface ToolDocument extends mongoose.Document {
  title: string;
  description: string;
  tags: string[];
  siteUrl: string;
  imgUrl?: string;
  features?: Feature[];
  featured?: boolean;
  isFree?: boolean;
  pricing?: number;
  createdAt: Date;
  updatedAt: Date;
}

const featuresSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true }
}, {
  _id: false
});

const toolSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  siteUrl: { type: String, required: true },
  imgUrl: { type: String, required: false },
  features: { type: [featuresSchema] },
  featured: { type: Boolean, default: false },
  isFree: { type: Boolean, default: undefined },
  pricing: { type: Number, default: undefined, min: 0 }
}, {
  timestamps: true
});

const Tool = mongoose.models.Tool || mongoose.model<ToolDocument>('Tool', toolSchema);

export default Tool;
export type { ToolDocument, Feature };
