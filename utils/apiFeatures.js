class APiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["sort", "field", "limit", "page"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString);
    this.query = this.query.find(queryString);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort);
    }
    return this;
  }

  field() {
    if (this.queryStr.field) {
      const selectStr = this.queryStr.field.split(",").join(" ");
      this.query = this.query.select(selectStr);
    }
    return this;
  }

  limit() {
    if (this.queryStr.limit) {
      this.query = this.query.limit(this.queryStr.limit * 1);
    }
    return this;
  }

  page() {
    if (this.queryStr.page) {
      const page = this.queryStr.page * 1;
      const limit = this.queryStr.limit * 1 || 4;

      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APiFeatures;
