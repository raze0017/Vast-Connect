import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      role: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        await handleLogin();
      }
    } catch (error) {
      console.error("Sign up failed", error);
      setError(
        error.response?.data?.errors?.[0]?.msg ||
          "Sign up failed. Please try again."
      );
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { username: formData.username, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("username", formData.username); // Save username from input

        const token = response.data.token;
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        localStorage.setItem("userId", decodedToken.id);
        localStorage.setItem("role", formData.role); // Store role
        window.location.href = "/feed";
      }
    } catch (error) {
      console.error("Login failed", error);
      setError(
        "Login failed. Please check your username and password and try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium info mb-1">Role</label>
          <div className="flex space-x-4">
            <label className="info">
              <input
                type="radio"
                value="STUDENT"
                checked={formData.role === "STUDENT"}
                onChange={handleRoleChange}
              />{" "}
              Student
            </label>
            <label className="info">
              <input
                type="radio"
                value="PROFESSOR"
                checked={formData.role === "PROFESSOR"}
                onChange={handleRoleChange}
              />{" "}
              Professor
            </label>
            <label className="info">
              <input
                type="radio"
                value="EMPLOYER"
                checked={formData.role === "EMPLOYER"}
                onChange={handleRoleChange}
              />{" "}
              Employer
            </label>
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium info mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-primary border border-gray-600 rounded-lg focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium info mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-primary border border-gray-600 rounded-lg focus:outline-none"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium info mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-primary border border-gray-600 rounded-lg focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium info mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-primary border border-gray-600 rounded-lg focus:outline-none"
            placeholder="Confirm your password"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full p-3 neutral text-primary font-semibold rounded-lg hover:base-100 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
