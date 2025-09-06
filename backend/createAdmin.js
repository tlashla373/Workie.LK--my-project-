const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Profile = require('./models/Profile');
require('dotenv').config();

// Create admin user script
async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workie');
    console.log('Connected to MongoDB');

    // Admin user details
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@workie.lk',
      password: 'Admin123!', // Change this to a secure password
      userType: 'admin',
      phone: '+94771234567',
      isVerified: true,
      isActive: true,
      isEmailVerified: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const adminUser = await User.create({
      ...adminData,
      password: hashedPassword
    });

    // Create admin profile
    await Profile.create({ 
      user: adminUser._id,
      bio: 'System Administrator'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🆔 User ID:', adminUser._id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();
