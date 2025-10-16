const {
  selectEvents,
  selectEventById,
  insertEvent,
} = require("../models/events.model");

exports.getEvents = (req, res) => {
  return selectEvents().then((events) => {
    res.status(200).send({ events });
  });
};

exports.getEventById = (req, res, next) => {
  const { event_id } = req.params;

  return selectEventById(event_id)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch(next);
};

exports.postEvent = (req, res, next) => {
  const {
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
  } = req.body;

  //Check for missing fields
  const requiredFields = {
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
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null || value === "") {
      return Promise.reject({ status: 400, msg: "Missing required field!" });
    }
  }

  // Check for type and format
  const isInvalid =
    isNaN(Number(category_id)) ||
    Number(category_id) <= 0 ||
    isNaN(Number(capacity)) ||
    Number(capacity) <= 0 ||
    isNaN(Number(price)) ||
    Number(price) < 0 ||
    isNaN(Date.parse(date)) ||
    !/^([01]\d|2[0-3]):([0-5]\d)$/.test(from_time) ||
    !/^([01]\d|2[0-3]):([0-5]\d)$/.test(to_time);

  if (isInvalid) {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type or format!",
    });
  }

  return insertEvent(
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
  )
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch(next);
};
