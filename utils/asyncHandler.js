const asyncHandler = fx => (req, res, next) => {
    Promise.resolve(fx(req, res, next)).catch(next);
}

module.exports = asyncHandler;