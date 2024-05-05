// index.js

const express = require("express");
const session = require("express-session");
const routes = require("./routes/routes");
const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;







const app = express();

app.use(
  session({
    secret: "",
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: ``,
      clientSecret: ``,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // You can handle user creation or retrieval here
      return done(null, profile);
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // console.log(req.user);
    var userName = req.user._json.name;
    var parts = userName.split(" ");
    var fname;

    var lname;
    var email = req.user._json.email;
    if (parts.length === 1) {
      fname = parts[0];
      lname = "";
    } else {
      fname = parts[0];
      lname = parts.slice(1).join(" ");
    }
    res.redirect(
      `/GetData.html?firstName=${fname}&lastName=${lname}&email=${email}}`
    );
  }
);
app.get("/userGoogle", (req, res) => {
  // Access user details from req.user
  const user = req.user;
  res.json(user);
});
const port = 3000;
app.use(express.static(path.join(__dirname, "public")));
// Use routes from routes.js
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
