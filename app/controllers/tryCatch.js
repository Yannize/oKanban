const Model = require('../models');


const tryCatch = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      // console.trace(error);
      res.status(500).json(error);
    }
  };
};


module.exports = tryCatch;



