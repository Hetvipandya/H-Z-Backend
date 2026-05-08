const Category = require("../models/Category");
const cloudinary = require("../config/cloudinaryConfig");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    let imageUrl = "";

    // ✅ Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url; // 🔥 IMPORTANT
    }

    const category = new Category({
      name: req.body.name,
      image: imageUrl,
      status: req.body.status || "active",
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log("GET CATEGORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET SINGLE CATEGORY
exports.getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log("GET SINGLE CATEGORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated",
      data: category,
    });
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    console.log("DELETE CATEGORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};