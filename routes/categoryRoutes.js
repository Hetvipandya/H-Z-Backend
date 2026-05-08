const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getSingleCategory, 
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// CREATE
router.post("/create", createCategory);

// READ
router.get("/", getCategories);
router.get("/:id", getSingleCategory);

// UPDATE
router.put("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

module.exports = router;