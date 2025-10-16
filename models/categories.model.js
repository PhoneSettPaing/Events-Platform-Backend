const db = require("../db/connection");

exports.selectCategories = () => {
  return db
    .query(`SELECT * FROM categories ORDER BY category_name;`)
    .then(({ rows }) => {
      return rows;
    });
};
