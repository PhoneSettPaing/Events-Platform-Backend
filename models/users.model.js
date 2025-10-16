const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserById = (user_id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(user_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid user_id format!",
    });
  }

  return db
    .query(`SELECT * FROM users where user_id = $1`, [user_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "user_id Not Found!" });
      }
      return rows[0];
    });
};

exports.updateUserById = (avatar_url, full_name, user_id) => {
  const query = [];
  const values = [];

  if (full_name && avatar_url) {
    query.push(
      `UPDATE users SET avatar_url = $1, full_name = $2 WHERE user_id = $3 RETURNING *`
    );
    values.push(avatar_url, full_name, user_id);
  } else if (full_name) {
    query.push(
      `UPDATE users SET full_name = $1 WHERE user_id = $2 RETURNING *`
    );
    values.push(full_name, user_id);
  } else {
    query.push(
      `UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING *`
    );
    values.push(avatar_url, user_id);
  }

  return db.query(query[0], values).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateUserRole = (user_id, role) => {
  return db
    .query(`UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *;`, [
      role,
      user_id,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};
