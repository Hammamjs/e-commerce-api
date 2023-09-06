const express = require("express");
const {
  createSubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  addIdToBody,
  setProductIdToBody,
} = require("../Services/SubCategoryServices");
const {
  createSubCategoryValidation,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/Validation/subCategoryValidation");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(addIdToBody, createSubCategoryValidation, createSubCategories)
  .get(setProductIdToBody, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
