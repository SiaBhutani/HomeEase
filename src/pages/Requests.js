import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use useParams to access URL parameters

function Requests() {
  const { professionalId } = useParams(); // Get professionalId from URL parameters
  console.log(professionalId);
  const [requests, setRequests] = useState([]);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `https://homeease-12co.onrender.com/api/professionals/${professionalId}/requests`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await res.json();
      console.log("Received from backend:", data);
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Handle Accept
  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(
        `https://homeease-12co.onrender.com/api/bookings/${requestId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure content type is JSON
          },
          body: JSON.stringify({
            professional_id: professionalId, // Send professional_id in the body
          }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to accept request");
      }
      alert("Request accepted!");
      fetchRequests();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Handle Reject
  const handleReject = async (requestId) => {
    try {
      const res = await fetch(
        `https://homeease-12co.onrender.com/api/bookings/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure content type is JSON
          },
          body: JSON.stringify({
            professional_id: professionalId, // Send professional_id in the body (optional depending on your backend logic)
          }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to reject request");
      }
      alert("Request rejected!");
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    if (professionalId) {
      console.log("Fetching for professional ID:", professionalId);
      fetchRequests();
    }
  }, [professionalId]); // Fetch requests when professionalId changes

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Service Requests</h2>
      {requests.length === 0 ? (
        <p>No requests right now.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Customer:</strong> {req.customer_name}
                </p>
                <p>
                  <strong>Date:</strong> {req.booking_date.split("T")[0]} |{" "}
                  <strong>Time:</strong> {req.booking_time}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;
