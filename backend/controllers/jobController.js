const jobQueries = require("../queries/jobQueries");

module.exports = {
  applyForJob: async (req, res) => {
    try {
      const { jobId } = req.body; // Get job ID from request body
      const applicantId = req.user.id; // Assuming authentication middleware sets req.user

      if (!jobId || !applicantId) {
        return res
          .status(400)
          .json({ error: "Job ID and Applicant ID are required" });
      }

      const application = await jobApplicationQueries.createApplication(
        applicantId,
        jobId
      );
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
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
