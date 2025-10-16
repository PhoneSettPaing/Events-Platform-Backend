const {
  selectBookedEvents,
  insertBookedEvent,
} = require("../models/booked_events.model");
const { selectUserById } = require("../models/users.model");

exports.getBookedEvents = (req, res, next) => {
  const { user_id } = req.params;

  const pendingUserIdCheck = selectUserById(user_id);
  const pendingBookedEvents = selectBookedEvents(user_id);

  Promise.all([pendingUserIdCheck, pendingBookedEvents])
    .then(([_, booked_events]) => {
      res.status(200).send({ booked_events });
    })
    .catch(next);
};

exports.postBookedEvent = (req, res, next) => {
  const { user_id } = req.params;
  const { event_id, full_name, email, phone, tickets } = req.body;

  //Check for missing fields
  const requiredFields = {
    event_id,
    full_name,
    email,
    phone,
    tickets,
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null || value === "") {
      return Promise.reject({ status: 400, msg: "Missing required field!" });
    }
  }

  // Check for type and format
  if (
    isNaN(Number(event_id)) ||
    isNaN(Number(tickets)) ||
    Number(event_id) <= 0 ||
    Number(tickets) <= 0 ||
    typeof full_name !== "string" ||
    typeof email !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type!",
    });
  }

  if (user_id) {
    const pendingUserIdCheck = selectUserById(user_id);
    const pendingBookedEventInsert = insertBookedEvent(
      event_id,
      user_id,
      full_name,
      email,
      phone,
      tickets
    );

    Promise.all([pendingUserIdCheck, pendingBookedEventInsert])
      .then(([_, booked_event]) => {
        res.status(201).send({ booked_event });
      })
      .catch(next);
  } else {
    return insertBookedEvent(
      event_id,
      user_id,
      full_name,
      email,
      phone,
      tickets
    ).then((booked_event) => {
      res.status(201).send({ booked_event });
    });
  }
};
