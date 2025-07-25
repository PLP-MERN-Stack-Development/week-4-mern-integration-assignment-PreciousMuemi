# 🚀 MERN Blog Application with MongoDB Atlas

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application with MongoDB Atlas integration, featuring user authentication, CRUD operations, and advanced features.

## ✨ Features

- **🔐 User Authentication**: JWT-based authentication with registration, login, and profile management
- **📝 Blog Posts**: Full CRUD operations for blog posts with rich content
- **🏷️ Categories**: Organize posts with categories and tags
- **💬 Comments**: Interactive commenting system on blog posts
- **🔍 Search & Filter**: Advanced search and filtering capabilities
- **📱 Responsive Design**: Modern, mobile-friendly UI
- **🛡️ Security**: Rate limiting, input validation, and security headers
- **☁️ Cloud Database**: MongoDB Atlas integration for scalable cloud storage

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend

- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd week-4-mern-integration-assignment-PreciousMuemi
```

### 2. MongoDB Atlas Setup

#### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

#### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

#### Step 3: Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

#### Step 4: Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

### 3. Environment Setup

#### Server Environment

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Important**: Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual MongoDB Atlas credentials.

#### Client Environment

1. Navigate to the client directory:

```bash
cd ../client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp env.example .env
```

4. Update `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Start the Server

```bash
cd server
npm run dev
```

You should see:

```
✅ MongoDB Atlas connected: <your-cluster>.mongodb.net
🚀 Server running on port 5000
📊 Environment: development
🌐 API URL: http://localhost:5000
```

#### Start the Client

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description       | Access  |
| ------ | -------------------- | ----------------- | ------- |
| POST   | `/api/auth/register` | Register new user | Public  |
| POST   | `/api/auth/login`    | Login user        | Public  |
| GET    | `/api/auth/me`       | Get current user  | Private |
| PUT    | `/api/auth/profile`  | Update profile    | Private |
| PUT    | `/api/auth/password` | Change password   | Private |

### Posts Endpoints

| Method | Endpoint                  | Description     | Access  |
| ------ | ------------------------- | --------------- | ------- |
| GET    | `/api/posts`              | Get all posts   | Public  |
| GET    | `/api/posts/:id`          | Get single post | Public  |
| POST   | `/api/posts`              | Create post     | Private |
| PUT    | `/api/posts/:id`          | Update post     | Private |
| DELETE | `/api/posts/:id`          | Delete post     | Private |
| POST   | `/api/posts/:id/comments` | Add comment     | Private |

### Categories Endpoints

| Method | Endpoint              | Description         | Access |
| ------ | --------------------- | ------------------- | ------ |
| GET    | `/api/categories`     | Get all categories  | Public |
| GET    | `/api/categories/:id` | Get single category | Public |
| POST   | `/api/categories`     | Create category     | Admin  |
| PUT    | `/api/categories/:id` | Update category     | Admin  |
| DELETE | `/api/categories/:id` | Delete category     | Admin  |

## 🔧 Development

### Project Structure

```
week-4-mern-integration-assignment-PreciousMuemi/
├── server/
│   ├── models/
│   │   ├── Post.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/
│   │   ├── posts.js
│   │   ├── categories.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── env.example
└── README.md
```

### Available Scripts

#### Server

```bash
npm run dev    # Start development server
npm start      # Start production server
```

#### Client

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for data validation
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for enhanced security
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Deployment

### Backend Deployment (Heroku)

1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

### Frontend Deployment (Vercel/Netlify)

1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

#### MongoDB Atlas Connection Issues

- Verify your connection string is correct
- Check if your IP is whitelisted in Network Access
- Ensure your database user has proper permissions

#### JWT Token Issues

- Make sure JWT_SECRET is set in your environment variables
- Check token expiration settings

#### CORS Issues

- Verify CLIENT_URL is set correctly
- Check that the frontend URL matches the CORS configuration

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check MongoDB Atlas cluster status

## 📞 Support

For support, please open an issue in the repository or contact the development team.
