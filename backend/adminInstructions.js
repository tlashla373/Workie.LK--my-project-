// Simple admin user creation without dependencies
const testAdmin = {
  method: 'POST',
  url: 'http://localhost:5000/api/auth/register',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'Admin',
    email: 'testadmin@workie.lk',
    password: 'TestAdmin123!',
    userType: 'admin',
    phone: '+94771234567'
  })
};

// Instructions to create admin via API
console.log('🔧 To create an admin user manually:');
console.log('1. Use Postman or any REST client');
console.log('2. Make a POST request to: http://localhost:5000/api/auth/register');
console.log('3. With this body:');
console.log(JSON.stringify({
  firstName: 'Test',
  lastName: 'Admin', 
  email: 'testadmin@workie.lk',
  password: 'TestAdmin123!',
  userType: 'admin',
  phone: '+94771234567'
}, null, 2));

console.log('\n📱 Then manually update the user in MongoDB:');
console.log('db.users.updateOne(');
console.log('  { email: "testadmin@workie.lk" },');
console.log('  { $set: { userType: "admin", isVerified: true, isEmailVerified: true } }');
console.log(')');

console.log('\n🔐 Then login at http://localhost:5173/loginpage with:');
console.log('Email: testadmin@workie.lk');
console.log('Password: TestAdmin123!');
