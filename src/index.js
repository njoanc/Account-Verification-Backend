import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import users from "./routes/users";
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../swagger.json";
// import googleAuth from "./config/googleAuth";

const app = express();

dotenv.config();
connectDB();
// googleAuth();

app.set("view engine", "ejs");

app.use(express.json());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/users", users);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
