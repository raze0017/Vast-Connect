import { useEffect, useState } from "react";
import axios from "axios";
function ApplicantList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const employerId = localStorage.getItem("userId"); // Get stored employer ID
        if (!employerId) {
          setError("Employer ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/employers/${employerId}`
        );
        setJobs(response.data); // Assuming API returns { jobs: [...] }
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Posted Jobs</h2>
      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-6">
        {jobs.map((job) => (
          <li key={job.id} className="p-5 bg-gray-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-white">{job.title}</h3>
            <p className="text-gray-300">{job.description}</p>
            <p className="text-gray-400 mt-1">
              <strong>Salary:</strong> {job.salary}
            </p>
            <p className="text-gray-400">
              <strong>Company:</strong> {job.company}
            </p>
            <p className="text-gray-400">
              <strong>Location:</strong> {job.location}
            </p>

            {/* Applicants Section */}
            <h4 className="text-white mt-4">Applicants:</h4>
            <ul className="text-gray-300 ml-4">
              {job.applicants.length > 0 ? (
                job.applicants.map((app) => (
                  <li key={app.id} className="border-b border-gray-600 py-2">
                    <p>
                      <strong>Name:</strong> {app.applicant.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {app.applicant.email}
                    </p>
                    <p>
                      <strong>Status:</strong> {app.status}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No applicants yet</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ApplicantList;
