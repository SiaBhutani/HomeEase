import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const fetchBookings = () => {
    axios
      .get(`http://localhost:5001/api/user-bookings/${userEmail}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to fetch bookings:", err));
  };

  useEffect(() => {
    if (!userEmail) {
      navigate("/sign");
      return;
    }
    fetchBookings();
  }, [userEmail, navigate]);

  const handleFeedbackClick = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post("http://localhost:5001/api/submit-feedback", {
        booking_id: selectedBookingId,
        message: feedback,
        rating,
      });
      alert("Feedback submitted!");

      // Reset modal state
      setSelectedBookingId(null);
      setFeedback("");
      setRating(0);

      // Fetch updated bookings
      fetchBookings();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Failed to submit feedback");
    }
  };

  // Function to display stars
  const renderStars = (rating) => {
    return (
      <div className="text-yellow-500">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
    );
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-green-100">
          <tr>
            {/* <th className="p-2 border">Booked On</th> */}
            <th className="p-2 border">Service</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Professional</th>
            <th className="p-2 border">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="text-center">
              {/* <td className="p-2 border">
                {new Date(booking.created_at).toLocaleString()}
              </td> */}
              <td className="p-2 border">{booking.service_name}</td>
              <td className="p-2 border">
                {booking.booking_date.split("T")[0]}
              </td>
              <td className="p-2 border">{booking.booking_time}</td>
              <td className="p-2 border">Rs. {booking.price}</td>
              <td className="p-2 border">{booking.professional_name}</td>
              <td className="p-2 border">
                {booking.status.toLowerCase() === "done" ? (
                  booking.message ? (
                    <div>
                      <span>{booking.message}</span>
                      <div>{renderStars(booking.feedback_rating)}</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFeedbackClick(booking.id)}
                      className="text-blue-500 underline"
                    >
                      Leave Feedback
                    </button>
                  )
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Feedback Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-3">Submit Feedback</h2>
            <textarea
              className="w-full border border-gray-300 p-2 rounded mb-3"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback..."
            />
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedBookingId(null);
                  setFeedback("");
                  setRating(0);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
