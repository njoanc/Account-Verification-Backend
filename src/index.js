import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import users from "./routes/users";
// import auth from "./routes/auth";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import passport from "./config/passport";
import path from "path";

const app = express();

dotenv.config();
connectDB();

app.use(express.json());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// configure the session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));

// Set the view engine to use
app.set("view engine", "ejs");

// Configure the view engine to look for views in the 'views/pages' directory
app.engine("ejs", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views", "pages"));

// Serialize user
passport.serializeUser(function (user, done) {
  done(null, user);
});

// Deserialize user
passport.deserializeUser(function (user, done) {
  done(null, user);
});
// Routes
app.use("/users", users);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*  Google AUTH  */

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
