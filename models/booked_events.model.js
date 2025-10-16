const db = require("../db/connection");

exports.selectBookedEvents = (user_id) => {
  return db
    .query(
      `SELECT b.*, e.title, e.date, e.from_time, e.to_time, e.location, e.city FROM booked_events b JOIN events e ON b.event_id = e.event_id WHERE b.user_id = $1 ORDER BY b.booked_at DESC;`,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertBookedEvent = (
  event_id,
  user_id,
  full_name,
  email,
  phone,
  tickets
) => {
  return db
    .query(
      `INSERT INTO booked_events (event_id, user_id, full_name, email, phone, tickets) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [event_id, user_id, full_name, email, phone, tickets]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
