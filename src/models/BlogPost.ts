import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  summary: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  status: 'draft' | 'published';
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  readTime: {
    type: Number,
    required: false,
    min: 1
  }
}, {
  timestamps: true
});

// Indexes
BlogPostSchema.index({ title: 'text', content: 'text' });
BlogPostSchema.index({ author: 1, createdAt: -1 });
BlogPostSchema.index({ status: 1, createdAt: -1 });
BlogPostSchema.index({ tags: 1 });

// Pre-save middleware to calculate read time
BlogPostSchema.pre('save', function(next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / wordsPerMinute);
  next();
});

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);