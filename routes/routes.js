const express = require("express");
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const NewUser = require("../models/NewUser");
const User = require("../models/User");
const Admin = require("../models/Admin");
const RandomData = require("../models/RandomData");
const UserData = require("../models/UserData");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require('bcryptjs');
const { hash } = require("crypto");
const { error } = require("console");
const { Op, where } = require('sequelize');
const { Where } = require("sequelize/lib/utils");

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
        res.redirect("/AdminProfilePage.html");
      } else {
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
    const user = await User.findOne({ where: { email: email } });
    const randomData = await RandomData.findAll({ where: { email: email } });
    const date = [];
    const completed = [];
    const rating = [];
    for (let i = 0; i < randomData.length; i++) {
      date.push(randomData[i].date);
      completed.push(randomData[i].completed);
      rating.push(randomData[i].rating);
    }
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Error comparing passwords");
        }
        if (result) {
          const userData = {
            firstName: user.fname,
            lastName: user.lname,
            email: user.email,
            phone: user.phone,
            inProgress: Math.floor(Math.random() * 11),
            date: date,
            completed: completed,
            rating: rating,
          }
          const data = JSON.stringify({ userData: userData });
          res.status(200).send(data);
        } else {
          const error = "Invalid credentials";
          const data = JSON.stringify({ error: error });
          res.status(200).send(data);
        }
      });
    } else {
      const error = "Invalid credentials";
      const data = JSON.stringify({ error: error });
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).send("Error in fetching data.");
  }
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const verificationCode = generateVerificationCode();
  const check = await User.findOne({
    where: {
      [Op.or]: [
        { email: email },
        { phone: phone }
      ]
    }
  });
  if (check) {
    const error = "User exists.";
    const data = JSON.stringify({ error: error });
    return res.status(200).send(data);
  }
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
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
        const success = "User created successfully";
        const data = JSON.stringify({ success: success });
        return res.status(200).send(data);
      } catch (error) {
        console.log("Error creating new user:", error);
        res.status(500).send("Error creating new user");
      }
    });
  } catch (error) {
    console.log("Error hashing password:", error);
    res.status(500).send("Error creating new user");
  }
});

// User signup verification route
router.post("/signupVerify", async (req, res) => {
  const { code } = req.body;

  const newUser = await NewUser.findOne({
    order: [["createdAt", "DESC"]],
  });
  const savedCode = newUser.verification_code;
  const currentTime = new Date();
  const createdAtTime = newUser.createdAt;
  const timeDifferenceMinutes = Math.floor((currentTime - createdAtTime) / (1000 * 60));
  if (timeDifferenceMinutes > 15) {
    const error = "Code expired.";
    const data = JSON.stringify({ error: error });
    return res.send(data);
  }

  else if (code === savedCode) {
    await User.create({
      fname: newUser.fname,
      lname: newUser.lname,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
    });

    const success = "Success";
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function generateRandomNumbers() {
      const randomNumbers = [];
      const today = new Date();

      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i);
        const randomNumber = getRandomInt(0, 10);
        randomNumbers.push({
          date: `${currentDate.getDate()}-${currentDate.getMonth() + 1}`,
          number: randomNumber
        });
      }
      return randomNumbers.reverse();
    }
    let random = generateRandomNumbers();
    for (let i = 0; i < random.length; i++) {
      await RandomData.create({
        email: newUser.email,
        date: random[i].date,
        completed: random[i].number,
        rating: Math.floor(Math.random() * 6),
      });
    }
    const data = JSON.stringify({ success: success });
    return res.status(200).send(data);
  } else {
    const error = "Incorrect code.";
    const data = JSON.stringify({ error: error });
    return res.send(data);
  }
});

router.post("/uploadImage", upload.single("image"), async (req, res) => {
  const { email } = req.body;
  try {
    const imagePath = req.file.path;
    await User.update({ image_path: imagePath }, { where: { email: email } });
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
      return res.json({ path: null });
    }
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
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});
router.post("/checkMail", async (req, res) => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode();
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const mailOptions = {
        from: "rizwanmehmood316@gmail.com",
        to: email,
        subject: "Your Password Recovery",
        text: `Your verification code is: ${verificationCode}`, // Include the password in the email text
      };
      try {
        await NewUser.create({
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          phone: user.phone,
          password: user.password,
          verification_code: verificationCode,
        });
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
          } else {
            res.json(user);
            res.status(200).send("Email sent successfully");
          }
        });
      } catch (error) {
        console.error("Error creating new user:", error);
        res.status(500).send("Error creating new user");
      }
    } else {
      res.status(401).send("Invalid email or password");
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
    if (user) {
      // Compare the old password with the hashed password
      const passwordMatch = await bcrypt.compare(oldPass, user.password);
      if (passwordMatch) {
        // Hash the new password before saving it
        const hashedNewPass = await bcrypt.hash(newPass, 10); // 10 is the salt rounds
        await user.update({ password: hashedNewPass });
        res.sendStatus(200);
      } else {
        res.status(401).send("Invalid password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});
router.post("/AddUser", async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;
  const check = await User.findOne({ where: { phone: phone } });
  if (check) {
    const error = "User exists.";
    const data = JSON.stringify({ error: error });
    return res.status(200).send(data);
  }
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    await User.create({
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      password: hashedPassword, // Store the hashed password
    });
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function generateRandomNumbers() {
      const randomNumbers = [];
      const today = new Date();

      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i);
        const randomNumber = getRandomInt(0, 10);
        randomNumbers.push({
          date: `${currentDate.getDate()}-${currentDate.getMonth() + 1}`,
          number: randomNumber
        });
      }
      return randomNumbers.reverse();
    }
    let random = generateRandomNumbers();
    for (let i = 0; i < random.length; i++) {
      await RandomData.create({
        email: email,
        date: random[i].date,
        completed: random[i].number,
        rating: Math.floor(Math.random() * 6),
      });
    }
    const inProgress = Math.floor(Math.random() * 11);
    const randomData = await RandomData.findAll({ where: { email: email } });
    const date = [];
    const completed = [];
    const rating = [];
    for (let i = 0; i < randomData.length; i++) {
      date.push(randomData[i].date);
      completed.push(randomData[i].completed);
      rating.push(randomData[i].rating);
    }
    const userData = {
      firstName: fname,
      lastName: lname,
      email: email,
      phone: phone,
      inProgress: Math.floor(Math.random() * 11),
      date: date,
      completed: completed,
      rating: rating,
    }
    const data = JSON.stringify({ userData: userData });
    res.status(200).send(data);
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send("Error creating new user");
  }
});
router.post("/verifyCode", async (req, res) => {
  const { code } = req.body;
  try {
    const newUser = await NewUser.findOne({
      order: [["createdAt", "DESC"]],
    });
    if (!newUser) {
      return res.status(500).send("No user records found");
    }

    const savedCode = newUser.verification_code;
    if (code === savedCode) {

      // Respond to client indicating success
      res.status(200).json({ redirectUrl: `/ResetPassword.html?email=${newUser.email}` });
    } else {
      const error = "Invalid Code.";
      const data = JSON.stringify({ error: error })
      res.status(200).send(data);
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).send("Error verifying code");
  }
});

router.post("/updatePassword", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { password: hashedPassword },
      { where: { email: email } }
    );
    res.status(200).json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Error updating user data" });
  }
});

router.post("/randomData", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await RandomData.findAll({ where: { email: email } });
    if (user) {
      const userData = user.map(item => {
        return {
          email: item.dataValues.email,
          date: item.dataValues.date,
          completed: item.dataValues.completed,
          rating: item.dataValues.rating
        };
      });
      res.status(200).json(userData);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});

router.post('/saveInUserData', async (req, res) => {
  const { email, firstName, lastName, country, city, facebook, linkedin, github } = req.body;
  try {
    let userData = await UserData.findOne({ where: { email: email } });

    if (userData) {
      await userData.update({
        fname: firstName,
        lname: lastName,
        country: country,
        city: city,
        facebook: facebook,
        linkedin: linkedin,
        github: github,
      });
    } else {
      await UserData.create({
        email: email,
        fname: firstName,
        lname: lastName,
        country: country,
        city: city,
        facebook: facebook,
        linkedin: linkedin,
        github: github,
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});

router.post('/getUserData', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserData.findOne({ where: { email: email } })
    if (user) {
      const data = JSON.stringify({
        email: user.dataValues.email,
        fname: user.dataValues.fname,
        lname: user.dataValues.lname,
        country: user.dataValues.country,
        city: user.dataValues.city,
        facebook: user.dataValues.facebook,
        linkedin: user.dataValues.linkedin,
        github: user.dataValues.github,
      });
      return res.status(200).send(data);
    }
    const mail = "";
    const data = JSON.stringify({ email: mail });
    res.status(200).send(data);
  }
  catch (error) {
    console.error("Error querying database:", error);
    res.status(500).send("Error querying database");
  }
});
module.exports = router;
