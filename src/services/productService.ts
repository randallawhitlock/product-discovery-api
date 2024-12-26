import { AppError } from '../types';
import Product, { IProduct } from '../models/Product';
import { Types } from 'mongoose';

interface ProductFilters {
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
}

class ProductService {
  async getAllProducts(filters: ProductFilters, page = 1, limit = 10) {
    const query: any = {};

    if (filters.category?.length) {
      query.category = { $in: filters.category };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    if (filters.tags?.length) {
      query.tags = { $in: filters.tags };
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    };
  }

  async getProductById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(productData: Partial<IProduct>) {
    const product = new Product(productData);
    await product.save();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<IProduct>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async deleteProduct(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async searchProducts(query: string) {
    return Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .lean();
  }

  async getProductsByCategory(category: string, limit = 10) {
    return Product.find({ category })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

export default new ProductService();