const express = require("express");
const router = express.Router();
const { applyForJob } = require("../controllers/jobApplicationController");

console.log("Job application routes loaded"); // ✅ Check if the file is loaded

router.post(
  "/",
  (req, res, next) => {
    console.log("Apply route hit!"); // ✅ Check if the route is hit
    next();
  },
  applyForJob
);

module.exports = router;
