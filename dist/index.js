"use strict";

var _express = _interopRequireDefault(require("express"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
require("dotenv").config();
var app = (0, _express["default"])();

//create a write stream (in append mode)

var accessLogStream = _fs["default"].createWriteStream(_path["default"].join(__dirname, "access.log"), {
  flags: "a"
});

//setup the logger

app.use((0, _morgan["default"])("combined", {
  stream: accessLogStream
}));
app.use(_express["default"].json());
app.use((0, _cors["default"])());
var errorHandler = function errorHandler(error, request, response, next) {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malformatted id"
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message
    });
  }
  next(error);
};
app.use(errorHandler);
var unkownEndpoint = function unkownEndpoint(request, response) {
  response.status(404).send({
    error: "unknown endpoint"
  });
};
app.use(unkownEndpoint);
var PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});