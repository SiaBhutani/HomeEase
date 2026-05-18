import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Cart({ userEmail }) {
  const location = useLocation();
  const service = location.state;
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userEmail) {
      navigate("/sign");
    }
  }, [userEmail, navigate]);

  const handleBooking = async () => {
    if (!userEmail) {
      setMessage("You must be logged in to book.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/bookings", {
        email: userEmail,
        service_id: service.id, // Ensure you are passing the correct service id
        date,
        time,
        price: parseFloat(service.price.replace("Rs.", "")), // Ensure price is passed as a number
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(error.response?.data?.error || "Booking failed.");
    }
  };

  if (!service) {
    return <p className="text-center text-red-600">No service selected.</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-6">
        {/* Image section (Left) */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={service.image}
            alt="Service"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

        {/* Booking form section (Right) */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Confirm Your Booking</h2>
          <p className="mb-2">
            <strong>Service:</strong> {service.title}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {service.description}
          </p>
          <p className="mb-4">
            <strong>Price:</strong> Rs. {service.price}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            onClick={handleBooking}
            className="bg-teal-800 text-white px-6 py-2 rounded hover:bg-teal-900"
          >
            Book Now
          </button>

          {message && (
            <div className="mt-4 text-center text-red-600 font-semibold">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
