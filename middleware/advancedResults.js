const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    const reqQuery = {...req.query};

    const removeFields = ["select"];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryString = JSON.stringify(reqQuery);

    query = model.find(JSON.parse(queryString));

    if (req.query.select) {
        const fields = req.query.select.split(",").join(' ');
        query = query.select(fields);
    }

    if(populate){
        query = query.populate(populate);
    }

    const results = await query;

    res.advancedResults = {
        success: true,
        count: results.length,
        data: results
    }

    next();
}


module.exports = advancedResults;