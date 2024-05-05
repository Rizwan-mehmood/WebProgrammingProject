const express = require("express");
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const NewUser = require("../models/NewUser");
const User = require("../models/User");
const Admin = require("../models/Admin");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require('bcryptjs');
const { hash } = require("crypto");
router.use(express.json());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rizwanmehmood316@gmail.com",
    pass: "geiv ezpz jsur ckty",
  },
});

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/UserImages/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const originalFileNameWithoutExt = path.basename(file.originalname, ext);
    const imageFileName = `${originalFileNameWithoutExt}_${Date.now()}${ext}`;
    cb(null, imageFileName);
  },
});

const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "..", "views")));

// Admin login route
router.post("/AdminLogin", (req, res) => {
  const { username, password } = req.body;

  Admin.findOne({
    where: {
      username: username,
      password: password,
    },
  })
    .then((admin) => {
      if (admin) {
        console.log("Admin login successful");
        res.redirect("/AdminProfilePage.html");
      } else {
        console.log("Invalid admin credentials");
        res.status(401).send("Invalid admin credentials");
      }
    })
    .catch((err) => {
      console.error("Error querying admin:", err);
      res.status(500).send("Error querying admin");
    });
});

// User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      // Compare passwords
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Error comparing passwords");
        }
        if (result) {
          console.log("User login successful");
          res.redirect(
            `/ProfilePage.html?firstName=${user.fname}&lastName=${user.lname}&email=${user.email}&phone=${user.phone}&bio=${user.bio}`
          );
        } else {
          console.log("Invalid user credentials");
          res.status(401).send("Invalid user credentials");
        }
      });
    } else {
      console.log("Invalid user credentials");
      res.status(401).send("Invalid user credentials");
    }
  } catch (error) {
    console.error("Error querying user:", error);
    res.status(500).send("Error querying user");
  }
});

// User signup route
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const verificationCode = generateVerificationCode();
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send("Error creating new user");
      }
      try {
        await NewUser.create({
          fname: firstName,
          lname: lastName,
          email: email,
          phone: phone,
          password: hash,
          verification_code: verificationCode,
        });

        const mailOptions = {
          from: "rizwanmehmood316@gmail.com",
          to: email,
          subject: "Welcome to ShopEx! Please verify your email",
          text: `Your verification code is: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions);
        res.redirect("EmailVerificationPage.html");
      } catch (error) {
        console.error("Error creating new user:", error);
        res.status(500).send("Error creating new user");
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Error creating new user");
  }
});

// User signup verification route
router.post("/signupVerify", async (req, res) => {
  const { code } = req.body;

  try {
    const newUser = await NewUser.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!newUser) {
      return res.status(500).send("No user records found");
    }

    const savedCode = newUser.verification_code;
    const currentTime = new Date();
    const createdAtTime = newUser.createdAt;
    const timeDifferenceMinutes = Math.floor((currentTime - createdAtTime) / (1000 * 60));
    if (timeDifferenceMinutes < 15) {
      return res.json({ error: "Code expired" });
    }

    else if (code === savedCode) {
      await User.create({
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
      });

      res.redirect("/LoginPage.html");
    } else {
      res.redirect("/EmailVerificationPage.html?error=1"); // Incorrect code error
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).send("Error verifying code");
  }
});

router.post("/uploadImage", upload.single("image"), async (req, res) => {
  const { email } = req.body;

  try {
    const imagePath = req.file.path;
    await User.update({ image_path: imagePath }, { where: { email: email } });
    console.log("Image path updated in database:", imagePath);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating image path in database:", error);
    res.status(500).send("Error updating image path in database");
  }
});

router.post("/forgotVerify", (req, res) => {
  res.redirect("ResetPassword.html");
});

router.post("/Verify", (req, res) => {
  res.redirect("Verification.html");
});

router.post("/getImage", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user || !user.image_path) {
      console.log("No image found for the user");
      return res.json({ path: null });
    }
    console.log("Image path found:", user.image_path);
    res.json({ path: user.image_path });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});

router.post("/updateInfo", async (req, res) => {
  const { fname, lname, email, phone, bio } = req.body;

  try {
    await User.update(
      { fname: fname, lname: lname, phone: phone, bio: bio },
      { where: { email: email } }
    );
    console.log("User data updated successfully");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Error updating user data");
  }
});

router.post("/getData", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.json(user);
    } else {
      res.status(401).send("Invalid email or password");
      console.log("Invalid email or password");
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});
router.post("/checkMail", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const mailOptions = {
        from: "rizwanmehmood316@gmail.com",
        to: email,
        subject: "Your Password Recovery",
        text: `Your password is: ${user.password}`, // Include the password in the email text
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).send("Error sending email");
        } else {
          console.log("Email sent:", info.response);
          res.json(user);
          res.status(200).send("Email sent successfully");
        }
      });
    } else {
      res.status(401).send("Invalid email or password");
      console.log("Invalid email or password");
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});

router.post("/resetPassword", async (req, res) => {
  const { email, oldPass, newPass } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user && user.password === oldPass) {
      await user.update({ password: newPass });
      console.log("User data updated successfully");
      res.sendStatus(200);
    } else {
      res.status(401).send("Invalid password");
      console.log("Invalid password");
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});
router.post("/AddUser", async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;
  try {
    await User.create({
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      password: password,
    });
    bio = "";
    res.redirect(
      `/ProfilePage.html?firstName=${fname}&lastName=${lname}&email=${email}&phone=${phone}&bio=${bio}}`
    );
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send("Error creating new user");
  }
});
module.exports = router;
