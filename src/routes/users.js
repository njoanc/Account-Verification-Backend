import express from "express";
import users from "../controllers/users.js";
import auth from "../controllers/auth.js";
import passport from "../config/passport";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", users.createUser);
router.get("/verify/:id/:token", users.verifyEmail);
router.post("/login", auth.login);

// Route handler for /success
router.get("/success", function (req, res) {
  res.render("success");
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/users/success");
  }
);

router.post("/reset-password", isAuthenticated, auth.resetPassword);
router.post("/reset-password/:token", isAuthenticated, auth.resetLink);
router.patch(
  "/:userId",
  isAuthenticated,
  upload.fields([
    { name: "nationalIdPic", maxCount: 1 },
    { name: "passportPic", maxCount: 1 },
  ]),
  users.accountVerification
);

router.post("/logout", auth.logout);
export default router;
