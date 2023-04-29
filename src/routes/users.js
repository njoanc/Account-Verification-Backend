import express from "express";
import users from "../controllers/users.js";

const router = express.Router();

router.post("/signup", users.createUser);

export default router;
