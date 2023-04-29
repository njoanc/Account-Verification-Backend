import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }
      const passwordMatch = await user.verifyPassword(password);
      if (!passwordMatch) {
        return done(null, false, { message: "Invalid email or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
