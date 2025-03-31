import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ApplicantList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const employerId = localStorage.getItem("userId");
        if (!employerId) {
          setError("Employer ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/employers/${employerId}`
        );
        setJobs(response.data);
      } catch (err) {
        setError("Failed to fetch jobs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="secondary text-primary p-6 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Job Listings</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card bg-neutral shadow-xl p-6 rounded-lg"
              >
                <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                <p className="info mb-4">{job.description}</p>
                <p className="text-gray-400">Company: {job.company}</p>
                <p className="text-gray-400">Salary: {job.salary}</p>
                <p className="text-gray-400">Location: {job.location}</p>
                <p className="text-gray-400">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <h4 className="text-xl font-semibold mt-4 mb-2">Applicants:</h4>
                {job.applicants.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {job.applicants.map((applicant) => (
                      <li key={applicant.id} className="mb-2">
                        <Link
                          to={`/profile/${applicant.applicant.id}`}
                          className="text-accent hover:underline"
                        >
                          {applicant.applicant.username}
                        </Link>
                        <span className="text-gray-400 ml-2">
                          ({applicant.status})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No applicants yet.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No jobs posted.</p>
        )}
      </div>
    </div>
  );
}

export default ApplicantList;
