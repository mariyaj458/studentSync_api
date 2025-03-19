// const fs = require("fs");
// const path = require("path");

// const logErrorToFile = (err) => {
//   const logPath = path.join(__dirname, "../log/error.log");
//   const errorMessage = `${new Date().toISOString()} - ${
//     err.stack || err.message
//   }\n`;

//   fs.appendFile(logPath, errorMessage, (err) => {
//     if (err) console.log("Error writing to log file", err);
//   });
// };

// const errorHandler = (err, req, res, next) => {
//   console.log(err.stack);

//   logErrorToFile(err);

//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// };

const logger = require("./logger"); // Import logger

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Logs to console (only for development)

  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl, // Logs the route where the error happened
    method: req.method, // Logs HTTP method (GET, POST, etc.)
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
