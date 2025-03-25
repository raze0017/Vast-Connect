require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/usersQueries");

module.exports = {
  signUpPost: async (req, res) => {
    // Validate sign up and handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Add user to database
    const { email, username, password, role } = req.body;
    const newUser = await userQueries.addUser(email, username, password, role);

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  },
  logInPost: async (req, res) => {
    const { username, password } = req.body;

    // Verify user login
    const user = await userQueries.existUser("username", username);
    if (!user)
      return res.status(401).json({
        message: "Username not found",
      });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({
        message: "Invalid password",
      });

    // Create jwt token
    jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        res.status(200).json({ token });
      }
    );
  },

  demoLogInPost: async (req, res) => {
    const demoUsername = "anonymous";
    const demoEmail = "anonymous@example.com";
    const demoPassword = "anonymous123"; // Fixed demo password

    // Check if the demo user exists
    let user = await userQueries.existUser("username", demoUsername);

    // If the demo user does not exist, create it
    if (!user) {
      const hashedPassword = await bcrypt.hash(demoPassword, 10);
      user = await userQueries.addUser(demoEmail, demoUsername, hashedPassword);
    }

    // Create jwt token
    jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Error generating token" });
        }
        res.status(200).json({ token });
      }
    );
  },
};
