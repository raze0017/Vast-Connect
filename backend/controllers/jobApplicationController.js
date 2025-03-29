const jobApplicationQueries = require("../queries/jobApplicationQueries");

const applyForJob = async (req, res) => {
  try {
    console.log("applyForJob called!");
    console.log("Request Body:", req.body);

    const { jobId, username } = req.body;
    console.log("Extracted Job ID:", jobId);
    console.log("Extracted Username:", username);

    if (!jobId || !username) {
      return res
        .status(400)
        .json({ error: "Job ID and Username are required" });
    }

    // Create application with username instead of ID
    await jobApplicationQueries.createApplication(username, jobId);

    res.status(201).json({ message: "Application submitted" });
  } catch (error) {
    console.error("Error in applyForJob:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { applyForJob };
