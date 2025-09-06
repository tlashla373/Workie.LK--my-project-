const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Find admin users script
async function findAdminUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workie');
    console.log('Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ userType: 'admin' }).select('-password');
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in the database');
    } else {
      console.log('✅ Found admin users:');
      console.log('=' .repeat(50));
      
      adminUsers.forEach((admin, index) => {
        console.log(`Admin ${index + 1}:`);
        console.log(`📧 Email: ${admin.email}`);
        console.log(`👤 Name: ${admin.firstName} ${admin.lastName}`);
        console.log(`📱 Phone: ${admin.phone || 'Not set'}`);
        console.log(`✅ Active: ${admin.isActive}`);
        console.log(`✅ Verified: ${admin.isVerified}`);
        console.log(`🆔 ID: ${admin._id}`);
        console.log('-'.repeat(30));
      });
      
      console.log('\n🔐 To login as admin:');
      console.log('1. Go to: http://localhost:5173/loginpage');
      console.log('2. Use the email and password for any of the above admin accounts');
      console.log('3. You will be redirected to /admin dashboard automatically');
    }

  } catch (error) {
    console.error('❌ Error finding admin users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

findAdminUsers();
