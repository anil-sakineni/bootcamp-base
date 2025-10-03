const { countDocuments } = require("../models/BootCamp");

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort"];
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
    const fields = req.query.sort.split(",").join(" ");
    query = query.sort(fields);
  }else{
    query = query.sort({ _id: 1 });
  }

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  res.advancedResults = {
    success: true,
    count: results.length,
    data: results,
  };

  next();
};

module.exports = advancedResults;
