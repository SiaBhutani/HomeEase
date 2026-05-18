import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });

      const { userName, userId, role, dashboardUrl } = res.data;

      // Store user data in localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", userId);

      if (role === "professional") {
        localStorage.setItem("professionalId", userId); // 👈 This is key
      }

      // ✅ Pass the correct professionalId (userId if professional)
      onLogin(
        userName,
        email,
        role,
        null,
        role === "professional" ? userId : null
      );

      // Redirect
      navigate(dashboardUrl);
    } catch (error) {
      setErrorMsg("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url(/img/homeease1.jpeg)" }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mb-4 border rounded"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mb-6 border rounded"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Sign In
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-600 mt-2 text-center">{errorMsg}</p>
        )}

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <span
            className="text-green-700 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
