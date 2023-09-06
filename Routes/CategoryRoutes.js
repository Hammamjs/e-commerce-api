const express = require("express");
const auth = require("../Services/AuthService");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../Services/CategoryServices");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/Validation/CategoryValidation");

const subCategoryRoutes = require("./SubCategoryRoutes");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .get(auth.protect, auth.allowedTo("admin"), getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
