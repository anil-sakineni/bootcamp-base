const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryString));

  if (req.params.bootcampId) {
    query = query.find({ bootcamp: req.params.bootcampId });
  }

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const fields = req.query.sort.split(",").join(" ");
    query = query.sort(fields);
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  const pagination = {};

  pagination.next = {
    page: page + 1,
    limit: limit,
  };

  pagination.prev = {
    page: page - 1,
    limit: limit,
  };

  const results = await query;
  if (pagination.prev.page == 0) {
    pagination.prev = "";
  }
  if (results.length === 0) {
    pagination.next = "";
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    data: results,
    pagination,
  };

  next();
};

module.exports = advancedResults;
