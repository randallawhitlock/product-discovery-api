import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  affiliateLink?: string;
  category: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  thumbnail: { 
    type: String, 
    required: [true, 'Product thumbnail is required'],
    validate: {
      validator: (v: string) => /^https?:\/\/.+/.test(v),
      message: 'Thumbnail must be a valid URL'
    }
  },
  price: { 
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  affiliateLink: { 
    type: String,
    validate: {
      validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
      message: 'Affiliate link must be a valid URL'
    }
  },
  category: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.model<IProduct>('Product', ProductSchema);