const express = require("express");
const getApplicantsByEmployer = require("../controllers/jobController");

const router = express.Router();
router.get("/:employerId", getApplicantsByEmployer.getEmployerJobs);

module.exports = router;
