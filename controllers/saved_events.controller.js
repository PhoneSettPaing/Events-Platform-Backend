const {
  selectSavedEvents,
  insertSavedEvent,
  deleteSavedEvent,
} = require("../models/saved_events.model");
const { selectUserById } = require("../models/users.model");

exports.getSavedEvents = (req, res, next) => {
  const { user_id } = req.params;

  const pendingUserIdCheck = selectUserById(user_id);
  const pendingSavedEvents = selectSavedEvents(user_id);

  Promise.all([pendingUserIdCheck, pendingSavedEvents])
    .then(([_, saved_events]) => {
      res.status(200).send({ saved_events });
    })
    .catch(next);
};

exports.postSavedEvent = (req, res, next) => {
  const { user_id } = req.params;
  const { event_id } = req.body;

  if (!event_id) {
    return Promise.reject({ status: 400, msg: "Missing required field!" });
  } else if (isNaN(Number(event_id)) || Number(event_id) <= 0) {
    return Promise.reject({ status: 400, msg: "Invalid data type!" });
  }

  const pendingUserIdCheck = selectUserById(user_id);
  const pendingSavedEventsInsert = insertSavedEvent(user_id, event_id);

  Promise.all([pendingUserIdCheck, pendingSavedEventsInsert])
    .then(([_, saved_event]) => {
      res.status(201).send({ saved_event });
    })
    .catch(next);
};

exports.removeSavedEvent = (req, res, next) => {
  const { user_id } = req.params;
  const { event_id } = req.body;

  if (!event_id) {
    return Promise.reject({ status: 400, msg: "Missing required field!" });
  } else if (isNaN(Number(event_id)) || Number(event_id) <= 0) {
    return Promise.reject({ status: 400, msg: "Invalid data type!" });
  }

  const pendingUserIdCheck = selectUserById(user_id);
  const pendingSavedEventsDelete = deleteSavedEvent(user_id, event_id);

  Promise.all([pendingUserIdCheck, pendingSavedEventsDelete])
    .then(([_, saved_event]) => {
      if (saved_event.rowCount === 0) {
        return next({ status: 404, msg: "event_id Not Found!" });
      }
      res.status(204).send();
    })
    .catch(next);
};
