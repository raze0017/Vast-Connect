const jobQueries = require("../queries/jobQueries");

module.exports = {
  getEmployerJobs: async (req, res) => {
    try {
      const employerId = req.params.employerId;

      if (!employerId) {
        return res.status(400).json({ error: "Employer ID is required" });
      }

      const jobs = await jobQueries.getJobsByEmployer(employerId);

      // Fetch applicants for each job
      const jobsWithApplicants = await Promise.all(
        jobs.map(async (job) => {
          const applicants = await jobQueries.getApplicantsByJob(job.id);
          return { ...job, applicants };
        })
      );
      res.json(jobsWithApplicants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
