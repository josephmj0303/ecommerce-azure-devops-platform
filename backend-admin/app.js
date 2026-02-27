const createError = require("http-errors");
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const routes = require("./src/routes");
const dotenv = require("dotenv");
require("dotenv").config();
const { connect } = require("./src/config/db");
console.log('Routes type:', typeof routes);
// Load environment variables based on NODE_ENV

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const app = express();

console.log(`Environment file used: ${envFile}`);
console.log(`ORIGIN value: ${process.env.ORIGIN || "not set"}`);

const corsOptions = {
  origin: process.env.ORIGIN || "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware setup
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};  
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Connect to PostgreSQL database and start the server
Promise.all([connect()])
.then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Failed to start the server due to database connection error:', error);
});

module.exports = app;
