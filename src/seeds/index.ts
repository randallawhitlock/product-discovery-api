import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Product from '../models/Product';
import BlogPost from '../models/BlogPost';

dotenv.config();

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    profile: {
      bio: 'System Administrator',
      avatar: 'https://via.placeholder.com/150',
      social: {
        twitter: 'https://twitter.com/admin',
        linkedin: 'https://linkedin.com/in/admin'
      }
    }
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      bio: 'Regular user who loves cool products',
      avatar: 'https://via.placeholder.com/150',
      social: {
        twitter: 'https://twitter.com/john_doe'
      }
    }
  }
];

const products = [
  {
    name: 'Smart Home Hub',
    description: 'Control your entire home with this smart hub. Features include voice control, automation, and integration with major smart home devices.',
    thumbnail: 'https://via.placeholder.com/300',
    price: 149.99,
    category: ['Electronics', 'Smart Home'],
    tags: ['smart home', 'automation', 'voice control']
  },
  {
    name: 'Eco-Friendly Water Bottle',
    description: 'Stay hydrated with this stylish, sustainable water bottle. Made from recycled materials and keeps drinks cold for 24 hours.',
    thumbnail: 'https://via.placeholder.com/300',
    price: 29.99,
    category: ['Lifestyle', 'Eco-Friendly'],
    tags: ['water bottle', 'sustainable', 'eco-friendly']
  },
  {
    name: 'Portable Solar Charger',
    description: 'Never run out of battery with this compact solar charger. Perfect for camping, hiking, or emergency situations.',
    thumbnail: 'https://via.placeholder.com/300',
    price: 79.99,
    category: ['Electronics', 'Outdoor'],
    tags: ['solar', 'charger', 'portable', 'outdoor']
  }
];

const blogPosts = [
  {
    title: 'Top 10 Smart Home Gadgets in 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Here are the top 10 smart home gadgets that will revolutionize your home...',
    summary: 'Discover the most innovative smart home devices that are changing the way we live.',
    tags: ['smart home', 'technology', 'gadgets'],
    status: 'published'
  },
  {
    title: 'Why Sustainable Products Matter',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...',
    summary: 'Learn about the importance of sustainable products and their impact on our environment.',
    tags: ['sustainability', 'eco-friendly', 'environment'],
    status: 'published'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      BlogPost.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Seed users
    const createdUsers = await Promise.all(
      users.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );
    console.log('Users seeded');

    // Seed products
    await Promise.all(
      products.map(product => Product.create(product))
    );
    console.log('Products seeded');

    // Seed blog posts (assigning to admin user)
    const adminUser = createdUsers[0];
    await Promise.all(
      blogPosts.map(post => 
        BlogPost.create({
          ...post,
          author: adminUser._id
        })
      )
    );
    console.log('Blog posts seeded');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();