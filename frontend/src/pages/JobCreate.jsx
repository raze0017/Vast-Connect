import { useState } from "react";
import axios from "axios";

function JobCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    const authorId = localStorage.getItem("userId");

    if (!token || !authorId) {
      setError("You need to be logged in to create a job post.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/jobs",
        { ...formData, authorId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Job posted successfully!");
        setFormData({
          title: "",
          description: "",
          company: "",
          location: "",
          salary: "",
        });
      }
    } catch (error) {
      console.error("Job creation failed", error);
      setError("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Job Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Company</label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Salary</label>
          <input
            id="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}

export default JobCreate;
