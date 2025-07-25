// test-connection.js - Test MongoDB Atlas connection

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Testing MongoDB Atlas connection...\n');

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in environment variables');
  console.log('   Please check your .env file\n');
  process.exit(1);
}

console.log('📡 Attempting to connect to MongoDB Atlas...\n');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 second timeout
})
.then(() => {
  console.log('✅ MongoDB Atlas connection successful!');
  console.log(`   Connected to: ${mongoose.connection.host}`);
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Port: ${mongoose.connection.port}\n`);
  
  // Test creating a simple document
  const TestSchema = new mongoose.Schema({
    test: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Test = mongoose.model('Test', TestSchema);
  
  return Test.create({ test: 'Connection test successful' });
})
.then((doc) => {
  console.log('✅ Database write test successful!');
  console.log(`   Created document with ID: ${doc._id}\n`);
  
  // Clean up test document
  return Test.findByIdAndDelete(doc._id);
})
.then(() => {
  console.log('✅ Database cleanup successful!\n');
  console.log('🎉 All tests passed! Your MongoDB Atlas connection is working correctly.\n');
  
  // Close connection
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.log('❌ MongoDB Atlas connection failed:');
  console.log(`   Error: ${error.message}\n`);
  
  console.log('🔧 Troubleshooting tips:');
  console.log('   1. Check your connection string in .env file');
  console.log('   2. Verify your IP is whitelisted in MongoDB Atlas');
  console.log('   3. Ensure your database user credentials are correct');
  console.log('   4. Check if your cluster is running\n');
  
  console.log('📚 For detailed setup instructions, see MONGODB_ATLAS_SETUP.md\n');
  
  process.exit(1);
}); 