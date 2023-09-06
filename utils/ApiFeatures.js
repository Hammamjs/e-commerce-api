class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
  }

  filter() {
    let queryString = { ...this.queryStr };
    let exclude = ["page", "limit", "sort", "fields"];
    exclude.forEach((field) => delete queryString[field]);
    queryString = JSON.stringify(queryString);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString);
    this.mongooseQuery = this.mongooseQuery.find(queryString);
    return this;
  }

  sorting() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replaceAll(",", " ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replaceAll(",", " ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryStr.keyword) {
      let query = {};
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.queryStr.keyword, $options: "i" } },
          { description: { $regex: this.queryStr.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryStr.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocuments) {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const paginate = {};
    paginate.page = page;
    paginate.limit = limit;
    paginate.pages = Math.ceil(countDocuments / limit);
    if (endIndex < countDocuments) {
      paginate.next = page + 1;
    }
    if (skip > 0) {
      paginate.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    this.paginationResult = paginate;
    return this;
  }
}

module.exports = ApiFeatures;
