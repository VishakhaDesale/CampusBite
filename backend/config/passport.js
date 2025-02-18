const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function (passport) {


  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            });
            console.log("New user created:", user.email);
          }

          // Force session save for new users
          if (req.session) {
            req.session.save();
          }

          return done(null, user);
        } catch (err) {
          console.error("Authentication error:", err);
          return done(err, null);
        }
      }
    )
  );

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean();
      if (!user) {
        console.error("User not found during deserialization:", id);
        return done(null, false);
      }
      console.log("Successfully deserialized user:", user.email);
      done(null, user);
    } catch (err) {
      console.error("Deserialization error:", err);
      done(err, null);
    }
  });
  
};

// module.exports = function (passport) {
//     passport.use(
//         new GoogleStrategy(
//             {
//                 clientID: process.env.GOOGLE_CLIENT_ID,
//                 clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//                 callbackURL: process.env.CALLBACK_URL,
//             },
//             async (accessToken, refreshToken, profile, done) => {

//                 //get the user data from google
//                 const newUser = {
//                     googleId: profile.id,
//                     displayName: profile.displayName,
//                     email: profile.emails[0].value
//                 }

//                 try {
//                     //find the user in our database or create user if not found
//                     let user = await User.findOne({ googleId: profile.id });
//                     if (!user) user = await User.create(newUser);
//                     done(null, user);
//                     console.log("Google Success")

//                 } catch (err) {
//                     console.error(err);
//                     console.log("Google Error")
//                 }
//             }
//         )
//     )

//     // used to serialize the user for the session
//     passport.serializeUser((user, done) => {
//         done(null, user.id)
//     })

//     // used to deserialize the user
//     // passport.deserializeUser((id, done) => {
//     //     User.findById(id, (err, user) => done(err, user))
//     // })
//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (err) {
//             done(err, null);
//         }
//     });

// }
