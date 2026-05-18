import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProfessionalDashboard = () => {
  const { professionalId } = useParams();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (professionalId) {
      axios
        .get(
          `https://homeease-12co.onrender.com/api/professional/${professionalId}/bookings`,
        )
        .then((res) => setBookings(res.data))
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, [professionalId]);

  const handleFinish = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:5001/api/professional/${professionalId}/booking/${bookingId}/finish`,
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "done" } : b,
        ),
      );
    } catch (err) {
      console.error("Error finishing the booking:", err);
    }
  };

  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const completedBookings = bookings.filter((b) => b.status === "done");

  const avgRating =
    bookings.length > 0
      ? (
          bookings.reduce((acc, b) => acc + (b.rating || 0), 0) /
          completedBookings.length
        ).toFixed(1)
      : "N/A";

  const renderTable = (data, showFinishButton = false) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Service</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Slot</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Rating</th>
            {showFinishButton && <th className="px-4 py-2 border">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b.bookingId}>
              <td className="px-4 py-2 border">{b.serviceName}</td>
              <td className="px-4 py-2 border">{b.customerName}</td>
              <td className="px-4 py-2 border">{b.customerAddress}</td>
              <td className="px-4 py-2 border">
                {b.booking_date
                  ? new Date(b.booking_date).toLocaleDateString()
                  : "N/A"}{" "}
                at {b.booking_time?.slice(0, 5) || "N/A"}
              </td>
              <td className="px-4 py-2 border capitalize">{b.status}</td>
              <td className="px-4 py-2 border">
                {b.rating !== null ? `⭐ ${b.rating}` : "No rating yet"}
              </td>
              {showFinishButton && (
                <td className="px-4 py-2 border">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleFinish(b.bookingId)}
                  >
                    Finish
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Professional Dashboard</h1>
      <p className="mb-6 text-green-700">Average Rating: {avgRating}</p>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Accepted Bookings</h2>
        {acceptedBookings.length === 0 ? (
          <p>No accepted bookings found.</p>
        ) : (
          renderTable(acceptedBookings, true)
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Completed Bookings</h2>
        {completedBookings.length === 0 ? (
          <p>No completed bookings found.</p>
        ) : (
          renderTable(completedBookings)
        )}
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
