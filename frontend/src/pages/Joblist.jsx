import { useEffect, useState } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/jobApplied?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAppliedJobs(new Set(response.data.appliedJobs));
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    const fetchEmployerName = async (authorId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/${authorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return response.data.user.username || "Unknown";
      } catch (error) {
        console.error("Error fetching employer name:", error);
        return "Unknown";
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const jobsData = response.data?.jobs || response.data || [];

        const jobsWithEmployers = await Promise.all(
          jobsData.map(async (job) => {
            const employerName = await fetchEmployerName(job.authorId);
            return { ...job, employerName };
          })
        );

        setJobs(jobsWithEmployers);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/apply`,
        { jobId, username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppliedJobs((prev) => new Set([...prev, jobId]));
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="var(--fallback-bc, #5C6BC0)" size={60} />
      </div>
    );
  }

  return (
    <div className="primary text-primary-content min-h-screen p-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-secondary">Job Listings</h2>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id || job._id}
                className="card primary shadow-xl p-6 border border-base-content"
              >
                <h3 className="text-2xl font-bold text-accent mb-2">
                  {job.title}
                </h3>
                <p className="text-lg mb-4 text-gray-200">{job.description}</p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p className="badge badge-neutral">Company: {job.company}</p>
                  <p>Salary: {job.salary}</p>
                  <p>Location: {job.location}</p>
                  <p>
                    Posted on: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <p>Posted by: {job.employerName}</p>
                </div>
                <button
                  onClick={() => handleApply(job.id || job._id)}
                  className={`mt-4 btn btn-primary w-full ${
                    appliedJobs.has(job.id || job._id) ? "btn-disabled" : ""
                  }`}
                  disabled={appliedJobs.has(job.id || job._id)}
                >
                  {appliedJobs.has(job.id || job._id)
                    ? "Submitted"
                    : "Submit Application"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">No jobs available.</p>
        )}
      </div>
    </div>
  );
};

export default JobList;
