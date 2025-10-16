const { selectCategories } = require("../models/categories.model");

exports.getCategories = (req, res) => {
  return selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
