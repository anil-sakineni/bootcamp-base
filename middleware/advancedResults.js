const { countDocuments } = require("../models/BootCamp");

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryString = JSON.stringify(reqQuery);

  //create operators ($gt, $gte, $lt, $lte)
  queryString = queryString.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`);

  query = model.find(JSON.parse(queryString));


  if (req.params.bootcampId) {
    query = query.find({ bootcamp: req.params.bootcampId });
  }

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-_id');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;

  const startIndex = (page -1) * limit;

  const endIndex = page * limit;
  const totalRecords = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const pagination = {};

  if(endIndex < totalRecords){
    pagination.next = {
      page: page +1,
      limit
    }
  }

  if(startIndex > 0){
    pagination.prev = {
            page : page - 1,
            limit
        } 
  }

  const results = await query;

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;


