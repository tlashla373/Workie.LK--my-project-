const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/workie')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const admins = await User.find({ userType: 'admin' }).select('email firstName lastName phone isActive');
    
    if (admins.length === 0) {
      console.log('No admin users found');
    } else {
      console.log('Admin users found:');
      admins.forEach(admin => {
        console.log(`- Email: ${admin.email}, Name: ${admin.firstName} ${admin.lastName}`);
      });
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err.message);
    mongoose.disconnect();
  });
