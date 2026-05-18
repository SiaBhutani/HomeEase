import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("customer");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Fetch available services
    axios
      .get("http://localhost:5001/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5001/signup", {
        name,
        email,
        password,
        address,
        role,
        service_id: role === "professional" ? serviceId : null,
      });

      navigate("/sign"); // Redirect to login
    } catch (error) {
      setErrorMsg("Signup failed. Email might already be used.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/img/homeease1.jpeg')` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1 text-gray-700">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 mb-3 border rounded"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mb-3 border rounded"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mb-3 border rounded"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-sm mb-1 text-gray-700">Address</label>
          <textarea
            className="w-full px-4 py-2 mb-4 border rounded resize-none"
            rows="2"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>

          <label className="block text-sm mb-1 text-gray-700">Role</label>
          <select
            className="w-full px-4 py-2 mb-3 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="professional">Service Professional</option>
          </select>

          {role === "professional" && (
            <>
              <label className="block text-sm mb-1 text-gray-700">
                Select Service You Provide
              </label>
              <select
                className="w-full px-4 py-2 mb-3 border rounded"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                required
              >
                <option value="">-- Select a service --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Create Account
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-600 mt-3 text-center">{errorMsg}</p>
        )}

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-green-700 hover:underline cursor-pointer"
            onClick={() => navigate("/sign")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
