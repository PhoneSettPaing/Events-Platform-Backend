const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api.controller");
const bookedEventsRouter = require("./booked_events-router");
const categoriesRouter = require("./categories-router");
const eventsRouter = require("./events-router");
const savedEventsRouter = require("./saved_events-router");
const usersRouter = require("./users-router");

apiRouter.get("/", getApi);
apiRouter.use("/users", usersRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/saved_events", savedEventsRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/booked_events", bookedEventsRouter);

module.exports = apiRouter;
