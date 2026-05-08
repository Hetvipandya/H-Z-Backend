const Product = require('../models/Product');
const cloudinary = require('../config/cloudinaryConfig');

// CREATE PRODUCT with images
exports.createProduct = async (req, res) => {
  console.log('📦 createProduct function called');
  console.log('Request body:', req.body);
  console.log('Files received:', req.files ? req.files.length : 0);
  
  try {
    // Extract fields from body
    const { 
      productName, 
      category, 
      price, 
      originalPrice, 
      stock, 
      description, 
      isBestSeller, 
      isSale 
    } = req.body;
    
    // Validate required fields
    if (!productName || !productName.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product name is required' 
      });
    }
    
    if (!category || !category.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category is required' 
      });
    }
    
    if (!price || isNaN(Number(price))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid price is required' 
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required' 
      });
    }
    
    // Upload images to Cloudinary
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });
    const imageUrls = await Promise.all(uploadPromises);
    
    // Create product
   const product = new Product({
  productName: productName.trim(),
  category: category.trim(),
  price: Math.floor(Number(price)),  // Convert to integer
  originalPrice: originalPrice ? Math.floor(Number(originalPrice)) : Math.floor(Number(price)),
  stock: stock ? Math.floor(Number(stock)) : 0,
  description: description || '',
  isBestSeller: isBestSeller === 'true' || isBestSeller === true,
  isSale: isSale === 'true' || isSale === true,
  image: imageUrls.length > 0 ? imageUrls[0] : '',
  images: imageUrls
});
    
    await product.save();
    console.log('✅ Product saved successfully:', product._id);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: product
    });
    
  } catch (error) {
    console.error('❌ CREATE PRODUCT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`📦 Found ${products.length} products`);
    
    res.status(200).json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('❌ GET PRODUCTS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error('❌ GET PRODUCT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Convert numeric fields
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    
    // Convert boolean fields
    if (updateData.isBestSeller) updateData.isBestSeller = updateData.isBestSeller === 'true';
    if (updateData.isSale) updateData.isSale = updateData.isSale === 'true';
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });
      const newImageUrls = await Promise.all(uploadPromises);
      
      updateData.image = newImageUrls.length > 0 ? newImageUrls[0] : updateData.image || '';
      
      if (updateData.existingImages) {
        const existingImages = JSON.parse(updateData.existingImages);
        updateData.images = [...existingImages, ...newImageUrls];
      } else {
        updateData.images = newImageUrls;
      }
      delete updateData.existingImages;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
    
  } catch (error) {
    console.error('❌ UPDATE PRODUCT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ DELETE PRODUCT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};