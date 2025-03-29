const jobQueries = require("../queries/jobQueries");

module.exports = {
  getEmployerJobs: async (req, res) => {
    try {
      const employerId = req.params.employerId;

      if (!employerId) {
        return res.status(400).json({ error: "Employer ID is required" });
      }

      const jobs = await jobQueries.getJobsByEmployer(employerId);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
