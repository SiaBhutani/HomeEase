import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Services({ isLoggedIn }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/services");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleAddNowClick = (service) => {
    if (!isLoggedIn) {
      navigate("/sign");
    } else {
      navigate("/cart", { state: service });
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-medium">
        Loading services...
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow p-4 text-center"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => {
                e.target.src = "/img/placeholder.jpg"; // fallback image
              }}
            />
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-3">{service.description}</p>
            <p className="text-orange-600 font-bold mb-3">
              Rs. {service.price}
            </p>
            <button
              onClick={() => handleAddNowClick(service)}
              className="bg-teal-800 text-white px-4 py-2 rounded hover:bg-teal-900"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
