import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams, // Import useParams to get URL parameters
} from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Services from "./pages/services";
import UserDashboard from "./pages/UserDashboard";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import Requests from "./pages/Requests";
import Cart from "./pages/Cart";

// ✅ App logic inside Router context
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Nn");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [professionalId, setProfessionalId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    const storedLogin = localStorage.getItem("isLoggedIn") === "true";
    const storedProfessionalId = localStorage.getItem("professionalId");

    if (storedProfessionalId) setProfessionalId(storedProfessionalId);
    if (storedLogin && storedEmail && storedName && storedRole) {
      setIsLoggedIn(true);
      setUserName(storedName);
      setUserEmail(storedEmail);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = (
    name,
    email,
    role,
    serviceId = null,
    professionalId = null,
    userId = null
  ) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);
    setUserRole(role);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);

    if (userId) {
      localStorage.setItem("userId", userId);
    }
    if (serviceId) {
      localStorage.setItem("serviceId", serviceId);
    }
    if (professionalId) {
      localStorage.setItem("professionalId", professionalId);
      setProfessionalId(professionalId);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("Nn");
    setUserEmail("");
    setUserRole("");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("serviceId");
    localStorage.removeItem("professionalId");

    // Ensure clean redirect after state reset
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-teal-800 text-white flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-2">
          <img
            src="/img/logo2.jpg"
            alt="logo"
            className="h-[50px] w-auto object-contain rounded-full"
          />
          <h1 className="text-xl font-bold">HomeEase</h1>
        </div>

        <nav className="flex space-x-6 items-center">
          {userRole === "professional" ? (
            // Professional-only Navbar
            <>
              <Link
                to={`/requests/${professionalId}`}
                className="hover:underline font-semibold"
              >
                Requests
              </Link>

              {isLoggedIn && (
                <div className="flex items-center space-x-3">
                  <img
                    src="/img/prof.jpg"
                    alt="Profile"
                    onClick={() =>
                      navigate(
                        `/professional-dashboard/${localStorage.getItem(
                          "userId"
                        )}`
                      )
                    }
                    className="w-10 h-10 rounded-full border-2 border-white hover:border-gray-300 cursor-pointer"
                  />
                  <div className="bg-white text-teal-800 px-3 py-1 rounded-full font-semibold">
                    Hi, {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            // Default Navbar for customer + guest
            <>
              <Link to="/" className="hover:underline font-semibold">
                Home
              </Link>
              <Link to="/services" className="hover:underline font-semibold">
                Services
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <img
                    src="/img/prof.jpg"
                    alt="Profile"
                    onClick={() => navigate(`/dashboard`)}
                    className="w-10 h-10 rounded-full border-2 border-white hover:border-gray-300 cursor-pointer"
                  />
                  <div className="bg-white text-teal-800 px-3 py-1 rounded-full font-semibold">
                    Hi, {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/sign"
                  className="bg-white text-teal-800 px-4 py-1 rounded hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/services"
            element={<Services isLoggedIn={isLoggedIn} />}
          />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route
            path="/professional-dashboard/:professionalId"
            element={<ProfessionalDashboard />}
          />
          <Route
            path="/requests/:professionalId"
            element={<Requests />} // Render the Requests page with professionalId
          />
          <Route path="/cart" element={<Cart userEmail={userEmail} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} HomeEase. All rights reserved.
          </p>
          <p>
            <Link to="/services" className="hover:underline">
              Services
            </Link>{" "}
            |{" "}
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

// ✅ Wrap AppContent in Router here
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
