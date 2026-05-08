const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads (memory storage for Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Log when routes file is loaded
console.log('🟢 Product routes file loaded');

// CREATE PRODUCT routes
router.post('/add', upload.array('images', 10), createProduct);
router.post('/create', upload.array('images', 10), createProduct);

// READ routes
router.get('/all', getProducts);
router.get('/:id', getProductById);

// UPDATE route
router.put('/:id', upload.array('images', 10), updateProduct);

// DELETE route
router.delete('/:id', deleteProduct);

// Test route to check if router is working
router.get('/test-route', (req, res) => {
  res.json({ message: 'Product routes are working!' });
});

console.log('✅ Product routes registered:');
console.log('   POST /api/product/add');
console.log('   POST /api/product/create');
console.log('   GET /api/product/all');
console.log('   GET /api/product/:id');
console.log('   PUT /api/product/:id');
console.log('   DELETE /api/product/:id');

module.exports = router;  