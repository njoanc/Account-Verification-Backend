import express from "express";
import users from "../controllers/users.js";
import auth from "../controllers/auth.js";
const router = express.Router();

router.post("/signup", users.createUser);
router.post("/login", auth.login);
export default router;
