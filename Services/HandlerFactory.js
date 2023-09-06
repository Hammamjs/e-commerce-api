const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/ApiFeatures");
const ApiError = require("../utils/ApiError");

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    const countDocuments = await Model.countDocuments();
    const { mongooseQuery, paginationResult } = new ApiFeatures(
      Model,
      req.query
    )
      .filter()
      .sorting()
      .search(modelName)
      .limitFields()
      .pagination(countDocuments);
    const documents = await mongooseQuery.find(req.filterObj);
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new ApiError("This document id not found ", 404));
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(
          `This document not found for this id ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new ApiError(
          `This document cannot be found for this id: ${req.params.id}`,
          204
        )
      );
    }
    res.status(200).send();
  });
