#!/usr/bin/env node

/**
 * MERN Blog Setup Script
 * This script helps set up the project and test MongoDB Atlas connection
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 MERN Blog Application Setup\n');

// Check if .env files exist
const serverEnvPath = path.join(__dirname, 'server', '.env');
const clientEnvPath = path.join(__dirname, 'client', '.env');

function checkEnvFiles() {
  console.log('📋 Checking environment files...\n');
  
  if (!fs.existsSync(serverEnvPath)) {
    console.log('❌ Server .env file not found');
    console.log('   Please copy server/env.example to server/.env and configure it\n');
    return false;
  }
  
  if (!fs.existsSync(clientEnvPath)) {
    console.log('❌ Client .env file not found');
    console.log('   Please copy client/env.example to client/.env and configure it\n');
    return false;
  }
  
  console.log('✅ Environment files found\n');
  return true;
}

function checkDependencies() {
  console.log('📦 Checking dependencies...\n');
  
  const serverPackagePath = path.join(__dirname, 'server', 'package.json');
  const clientPackagePath = path.join(__dirname, 'client', 'package.json');
  
  if (!fs.existsSync(serverPackagePath)) {
    console.log('❌ Server package.json not found');
    return false;
  }
  
  if (!fs.existsSync(clientPackagePath)) {
    console.log('❌ Client package.json not found');
    return false;
  }
  
  console.log('✅ Package files found\n');
  return true;
}

function installDependencies() {
  return new Promise((resolve) => {
    console.log('📦 Installing server dependencies...\n');
    
    const { exec } = require('child_process');
    exec('cd server && npm install', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Failed to install server dependencies:', error.message);
        resolve(false);
        return;
      }
      console.log('✅ Server dependencies installed\n');
      
      console.log('📦 Installing client dependencies...\n');
      exec('cd client && npm install', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Failed to install client dependencies:', error.message);
          resolve(false);
          return;
        }
        console.log('✅ Client dependencies installed\n');
        resolve(true);
      });
    });
  });
}

function testMongoConnection() {
  return new Promise((resolve) => {
    console.log('🔍 Testing MongoDB Atlas connection...\n');
    
    // Load environment variables
    require('dotenv').config({ path: serverEnvPath });
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in environment variables');
      console.log('   Please check your server/.env file\n');
      resolve(false);
      return;
    }
    
    const mongoose = require('mongoose');
    
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log('✅ MongoDB Atlas connection successful!');
      console.log(`   Connected to: ${mongoose.connection.host}\n`);
      mongoose.connection.close();
      resolve(true);
    })
    .catch((error) => {
      console.log('❌ MongoDB Atlas connection failed:');
      console.log(`   Error: ${error.message}\n`);
      console.log('   Please check:');
      console.log('   - Your connection string in server/.env');
      console.log('   - Your IP is whitelisted in MongoDB Atlas');
      console.log('   - Your database user credentials\n');
      resolve(false);
    });
  });
}

function showNextSteps() {
  console.log('🎉 Setup complete! Next steps:\n');
  console.log('1. Start the server:');
  console.log('   cd server && npm run dev\n');
  console.log('2. Start the client:');
  console.log('   cd client && npm run dev\n');
  console.log('3. Open your browser to http://localhost:3000\n');
  console.log('📚 For detailed setup instructions, see:');
  console.log('   - README.md');
  console.log('   - MONGODB_ATLAS_SETUP.md\n');
}

async function main() {
  try {
    // Check environment files
    if (!checkEnvFiles()) {
      console.log('Please set up your environment files first.\n');
      process.exit(1);
    }
    
    // Check dependencies
    if (!checkDependencies()) {
      console.log('Please ensure package.json files exist.\n');
      process.exit(1);
    }
    
    // Install dependencies
    const installSuccess = await installDependencies();
    if (!installSuccess) {
      console.log('Failed to install dependencies.\n');
      process.exit(1);
    }
    
    // Test MongoDB connection
    const mongoSuccess = await testMongoConnection();
    if (!mongoSuccess) {
      console.log('MongoDB connection test failed.\n');
      console.log('Please fix the connection issues before proceeding.\n');
      process.exit(1);
    }
    
    showNextSteps();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main }; 