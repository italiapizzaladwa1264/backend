const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const customerdataRoutes = require('./routes/customerdataRoutes');

// Initialize the app 
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error handler caught:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // You might want to notify and exit process here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You might want to notify and exit process here
});

// MongoDB connection with async try/catch
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Depending on your needs: retry, exit process, or continue in degraded mode
  }
})();

// API routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customerdata', customerdataRoutes);
 
module.exports = app;
