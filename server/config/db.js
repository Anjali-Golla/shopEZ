const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');

const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@shopezz.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log('No default admin account found. Automatically creating default admin account...');
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Default admin account created successfully.');
    } else {
      console.log('Default admin account already exists in database.');
    }
  } catch (error) {
    console.error(`Error automatically seeding admin account: ${error.message}`);
  }
};

const seedDefaultCategories = async () => {
  try {
    const count = await Category.countDocuments({});
    if (count <= 1) {
      console.log('No categories or partial categories found. Seeding default categories in MongoDB...');
      
      const defaultCategories = [
        {
          name: 'Electronics',
          parent: null,
          icon: 'FaLaptop',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Mobiles',
          parent: 'Electronics',
          icon: 'FaMobileAlt',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Laptops',
          parent: 'Electronics',
          icon: 'FaLaptop',
          image: 'https://images.unsplash.com/photo-1496181130204-7552cc14f1d0?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: "Men's Fashion",
          parent: null,
          icon: 'FaTshirt',
          image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: "Women's Fashion",
          parent: null,
          icon: 'FaTshirt',
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Footwear',
          parent: null,
          icon: 'FaRunning',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Watches',
          parent: null,
          icon: 'FaClock',
          image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Home & Kitchen',
          parent: null,
          icon: 'FaCouch',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Beauty',
          parent: null,
          icon: 'FaGem',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Sports',
          parent: null,
          icon: 'FaRunning',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Accessories',
          parent: null,
          icon: 'FaShoppingBag',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60',
        }
      ];

      await Category.deleteMany({});
      await Category.create(defaultCategories);
      console.log('Default categories seeded successfully.');
    } else {
      console.log('Categories already seeded in database.');
    }
  } catch (error) {
    console.error(`Error automatically seeding categories: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI is not set in environment variables');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    await seedAdminUser();
    await seedDefaultCategories();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not crash process.exit(1) so server container stays healthy on cloud platforms
  }
};

module.exports = connectDB;
