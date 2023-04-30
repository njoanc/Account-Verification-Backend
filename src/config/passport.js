import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:4002/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const userProfile = profile;
      return done(null, userProfile);
    }
  )
);

export default passport;
