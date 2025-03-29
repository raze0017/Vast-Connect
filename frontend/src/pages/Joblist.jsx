import { useEffect, useState } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    // Load applied jobs from localStorage
    const storedAppliedJobs =
      JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setAppliedJobs(new Set(storedAppliedJobs));

    const fetchEmployerName = async (authorId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${authorId}`,
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
        const response = await axios.get(`http://localhost:5000/jobs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    const username = localStorage.getItem("username");

    try {
      await axios.post(
        `http://localhost:5000/apply`,
        { jobId, username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update applied jobs state
      setAppliedJobs((prev) => {
        const newAppliedJobs = new Set([...prev, jobId]);
        localStorage.setItem(
          "appliedJobs",
          JSON.stringify([...newAppliedJobs])
        );
        return newAppliedJobs;
      });
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="#5C6BC0" size={60} />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Job Listings</h2>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id || job._id}
                className="p-4 border border-gray-700 rounded-lg shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                <p className="text-gray-300 mb-4">{job.description}</p>
                <p className="text-gray-400 mb-2">Company: {job.company}</p>
                <p className="text-gray-400 mb-2">Salary: {job.salary}</p>
                <p className="text-gray-400 mb-2">Location: {job.location}</p>
                <p className="text-gray-400 mb-2">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-400">Posted by: {job.employerName}</p>
                <button
                  onClick={() =>
                    handleApply(
                      job.id || job._id,
                      localStorage.getItem("username")
                    )
                  }
                  className={`mt-4 px-4 py-2 font-semibold rounded transition duration-300 ${
                    appliedJobs.has(job.id || job._id)
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
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
          <p className="text-gray-400">No jobs available.</p>
        )}
      </div>
    </div>
  );
};

export default JobList;
