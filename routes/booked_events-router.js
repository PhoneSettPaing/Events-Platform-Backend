const bookedEventsRouter = require("express").Router();
const {
  getBookedEvents,
  postBookedEvent,
} = require("../controllers/booked_events.controller");

bookedEventsRouter.post("/", postBookedEvent);
bookedEventsRouter
  .route("/:user_id")
  .get(getBookedEvents)
  .post(postBookedEvent);

module.exports = bookedEventsRouter;
