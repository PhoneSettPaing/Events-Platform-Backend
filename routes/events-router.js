const eventsRouter = require("express").Router();
const {
  getEvents,
  getEventById,
  postEvent,
} = require("../controllers/events.controller");

eventsRouter.get("/", getEvents).post("/", postEvent);
eventsRouter.route("/:event_id").get(getEventById);

module.exports = eventsRouter;
