const express = require("express");
const app = express();
const { badUrl } = require("./controllers/api.controller");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.all("/*splat", badUrl);

//custom errorhandler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//psql errorhandler
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
});

// 500 handler
app.use((err, req, res, next) => {
  console.log(err, "Unhandled Error");
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
