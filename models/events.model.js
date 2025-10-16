const db = require("../db/connection");

exports.selectEvents = () => {
  return db
    .query(
      `SELECT e.*, c.category_name, CAST(COALESCE(SUM(b.tickets), 0) AS INTEGER) AS attendees FROM events e LEFT JOIN categories c ON e.category_id = c.category_id LEFT JOIN booked_events b ON e.event_id = b.event_id GROUP BY e.event_id, c.category_name ORDER BY e.date ASC, e.from_time ASC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectEventById = (event_id) => {
  return db
    .query(
      `SELECT e.*, c.category_name, CAST(COALESCE(SUM(b.tickets), 0) AS INTEGER) AS attendees FROM events e LEFT JOIN categories c ON e.category_id = c.category_id LEFT JOIN booked_events b ON e.event_id = b.event_id WHERE e.event_id = $1 GROUP BY e.event_id, c.category_name ORDER BY e.date ASC, e.from_time ASC;`,
      [event_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "event_id Not Found!" });
      }
      return rows[0];
    });
};

exports.insertEvent = (
  image_url,
  title,
  description,
  category_id,
  capacity,
  price,
  date,
  from_time,
  to_time,
  location,
  city
) => {
  return db
    .query(
      `INSERT INTO events(image_url, title, description, category_id, capacity, price, date, from_time, to_time, location, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        image_url,
        title,
        description,
        category_id,
        capacity,
        price,
        date,
        from_time,
        to_time,
        location,
        city,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
