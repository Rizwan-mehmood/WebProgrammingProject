// routes.js

const express = require("express");
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const { resourceLimits } = require("worker_threads");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/UserImages/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    const originalFileNameWithoutExt = path.basename(file.originalname, ext); // Get the original filename without the extension
    const imageFileName = `${originalFileNameWithoutExt}_${Date.now()}${ext}`; // Concatenate the original filename, a timestamp, and the extension
    cb(null, imageFileName); // Set the filename to the concatenated value
  },
});

const upload = multer({ storage: storage });
router.use(express.json());
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rizwanmehmood316@gmail.com", // Enter your Gmail email address
    pass: "geiv ezpz jsur ckty", // Enter your Gmail password
  },
});

// Function to generate a random verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "riz12wan@",
  database: "shopex",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "..", "views")));
router.post("/AdminLogin", (req, res) => {
  const { username, password } = req.body;

  // Query to check if the provided email and password exist in the database
  const sql = "SELECT * FROM `admin` WHERE `username` = ? AND `password` = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      res.status(500).send("Error querying database");
      console.error("Error querying database:", err);
      return;
    }

    // Check if any record matches the provided email and password
    if (results.length > 0) {
      // User authenticated successfully
      console.log("Login successful");
      // Send fetched data along with redirect URL
      const userData = results[0]; // Assuming only one user is fetched
      return res.redirect("/AdminProfilePage.html");
    } else {
      // No matching record found
      res.status(401).send("Invalid email or password");
      console.log("Invalid email or password");
    }
  });
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Query to check if the provided email and password exist in the database
  const sql = "SELECT * FROM `users` WHERE `email` = ? AND `password` = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      res.status(500).send("Error querying database");
      console.error("Error querying database:", err);
      return;
    }

    // Check if any record matches the provided email and password
    if (results.length > 0) {
      // User authenticated successfully
      console.log("Login successful");
      // Send fetched data along with redirect URL
      const userData = results[0]; // Assuming only one user is fetched
      return res.redirect(
        `/ProfilePage.html?firstName=${userData.fname}&lastName=${userData.lname}&email=${userData.email}&phone=${userData.phone}&bio=${userData.bio}`
      );
    } else {
      // No matching record found
      res.status(401).send("Invalid email or password");
      console.log("Invalid email or password");
    }
  });
});

router.post("/signup", (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Generate a random verification code
  const verificationCode = generateVerificationCode();

  // Insert the form data into MySQL database
  const sql =
    "INSERT INTO `shopex`.`new_user` (`fname`, `lname`, `email`, `phone`, `password`, `verification_code`) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [firstName, lastName, email, phone, password, verificationCode],
    (err, result) => {
      if (err) {
        console.error("Email or phone already exists.", err);
        res.status(500).send("Email or phone already exists.");
      } else {
        console.log("Data saved successfully");

        // Send verification email
        const mailOptions = {
          from: "rizwanmehmood316@gmail.com",
          to: email,
          subject: "Welcome to ShopEx! Please verify your email",
          text: `Your verification code is: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
          } else {
            console.log("Email sent:", info.response);
            return res.redirect("EmailVerificationPage.html");
          }
        });
      }
    }
  );
});

router.post("/signupVerify", (req, res) => {
  const { code } = req.body; // Get the entered verification code from the form

  // Query to fetch the last inserted record from the new_user table
  const sql = "SELECT * FROM new_user ORDER BY id DESC LIMIT 1";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).send("Error querying database");
    }

    if (result.length === 0) {
      // No records found in the new_user table
      return res.status(500).send("No user records found");
    }

    const lastUser = result[0];
    const savedCode = lastUser.verification_code;

    // Check if the entered code matches the saved verification code
    if (code === savedCode) {
      // Code matches, proceed with saving user data to the permanent table
      const { fname, lname, email, phone, password } = lastUser;

      // Insert user data into the permanent users table
      const insertSql =
        "INSERT INTO users (fname, lname, email, phone, password) VALUES (?, ?, ?, ?, ?)";
      db.query(
        insertSql,
        [fname, lname, email, phone, password],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error saving user data:", insertErr);
            return res.status(500).send("Error saving user data");
          }

          console.log("User data saved to users table");

          // Redirect to a success page or perform any necessary action
          res.redirect("/LoginPage.html");
        }
      );
    } else {
      // Code doesn't match, redirect back to the verification page with an error message
      res.redirect("/EmailVerificationPage.html?error=1");
    }
  });
});

router.post("/uploadImage", upload.single("image"), (req, res) => {
  const { email } = req.body; // Assuming email is sent along with the image upload

  // Get the filename along with its path from req.file
  const imagePath = req.file.path;

  // Update the user record in the database with the image path
  const updateSql = "UPDATE users SET image_path = ? WHERE email = ?";
  db.query(updateSql, [imagePath, email], (err, result) => {
    if (err) {
      console.error("Error updating image path in database:", err);
      return res.status(500).send("Error updating image path in database");
    }
    console.log("Image path updated in database:", imagePath);
    res.sendStatus(200); // Sending a success response
  });
});

router.post("/forgotVerify", (req, res) => {
  console.log("Received data:", req.body);
  res.redirect("ResetPassword.html");
});

router.post("/Verify", (req, res) => {
  console.log("Received data:", req.body);
  res.redirect("Verification.html");
});
router.post("/getImage", (req, res) => {
  const { email } = req.body;
  // Query to fetch the image path from the database based on the user's email
  const sql = "SELECT image_path FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).send("Error querying database");
    }

    if (result.length === 0 || !result[0].image_path) {
      // No image found for the user
      console.log("No image found for the user");
      return res.json({ path: null });
    }

    // Image path found, send it back to the client
    const imagePath = result[0].image_path;
    console.log("Image path found:", imagePath);
    res.json({ path: imagePath });
  });
});
router.post("/updateInfo", (req, res) => {
  const { fname, lname, email, phone, bio } = req.body;
  const sql =
    "UPDATE users SET fname =?, lname =?, phone =?, bio=? WHERE email =?";
  db.query(sql, [fname, lname, phone, bio, email], (err, result) => {
    if (err) {
      console.error("Error updating user data:", err);
      return res.status(500).send("Error updating user data");
    }
    console.log("User data updated successfully");
    res.sendStatus(200); // Sending a success response
  });
});
module.exports = router;

router.post("/getData", (req, res) => {
  const { email } = req.body;
  console.log("Data collecting");
  console.log(email);
  // Query to check if the provided email and password exist in the database
  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      res.status(500).send("Error querying database");
      console.error("Error querying database:", err);
      return;
    }
    if (results.length > 0) {
      const userData = results[0];
      console.log("Sending Data : ", userData);
      res.json(userData);
    } else {
      res.status(401).send("Invalid email or password");
      console.log("Invalid email or password");
    }
  });
});
router.post("/resetPassword", (req, res) => {
  const { email, oldPass, newPass } = req.body;
  console.log("Data collecting");
  console.log(email);
  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      res.status(500).send("Error querying database");
      console.error("Error querying database:", err);
      return;
    }
    if (results.length > 0) {
      const userData = results[0];
      if (userData.password === oldPass) {
        console.log("Sending Data : ", userData);
        const sql = "UPDATE users SET password=? WHERE email =?";
        db.query(sql, [newPass, email], (err, result) => {
          if (err) {
            console.error("Error updating user data:", err);
            return res.status(500).send("Error updating user data");
          }
          console.log("User data updated successfully");
          res.sendStatus(200);
        });
      } else {
        res.status(401).send("Invalid password");
        console.log("Invalid password");
      }
    }
  });
});
