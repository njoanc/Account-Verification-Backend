import express from "express";
import users from "../controllers/users.js";
import auth from "../controllers/auth.js";
import passport from "../config/passport";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
const router = express.Router();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

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

router.post("/logout", isAuthenticated, auth.logout);
export default router;
