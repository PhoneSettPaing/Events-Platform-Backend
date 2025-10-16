const db = require("../db/connection");

exports.selectSavedEvents = (user_id) => {
  return db
    .query(
      `SELECT e.*, c.category_name, CAST(COALESCE(SUM(b.tickets), 0) AS INTEGER) AS attendees FROM saved_events s JOIN events e ON s.event_id = e.event_id LEFT JOIN categories c ON e.category_id = c.category_id LEFT JOIN booked_events b ON e.event_id = b.event_id WHERE s.user_id = $1 GROUP BY e.event_id, c.category_name ORDER BY e.date ASC, e.from_time ASC;`,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertSavedEvent = (user_id, event_id) => {
  return db
    .query(
      `INSERT INTO saved_events (user_id, event_id) VALUES ($1, $2) RETURNING *`,
      [user_id, event_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteSavedEvent = (user_id, event_id) => {
  return db
    .query(`DELETE FROM saved_events WHERE user_id = $1 AND event_id = $2;`, [
      user_id,
      event_id,
    ])
    .then((result) => {
      return result;
    });
};
