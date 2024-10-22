const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { errorHandler } = require("./common/errors");
const app = express();

app.use(morgan("dev"));
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", require("./routes"));
app.use("/api/v1/health", (req, res) => {
  res.send("OK");
});

app.use(errorHandler);

module.exports = app;
