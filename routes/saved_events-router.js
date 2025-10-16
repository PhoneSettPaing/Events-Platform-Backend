const savedEventsRouter = require("express").Router();
const {
  getSavedEvents,
  postSavedEvent,
  removeSavedEvent,
} = require("../controllers/saved_events.controller");

savedEventsRouter
  .route("/:user_id")
  .get(getSavedEvents)
  .post(postSavedEvent)
  .delete(removeSavedEvent);

module.exports = savedEventsRouter;
