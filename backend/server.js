const express = require("express");
const mysql = require("mysql2/promise"); // ← Use promise wrapper
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection (async pool)
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "homeease",
};

let db;

mysql
  .createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .then((connection) => {
    db = connection; // IMPORTANT
    console.log("MySQL connected successfully");
  })
  .catch((err) => {
    console.error("MySQL connection error:", err);
  });

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password, address, role, service_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (full_name, email, password, address, role, service_id) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(sql, [
      name,
      email,
      hashedPassword,
      address,
      role || "customer",
      role === "professional" ? service_id : null,
    ]);
    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    let dashboardUrl = "";
    let professionalId = null;

    if (user.role === "customer") {
      dashboardUrl = `/dashboard`;
    } else if (user.role === "professional") {
      dashboardUrl = `/professional-dashboard/${user.id}`;
      professionalId = user.id;
    }

    res.json({
      message: "Login successful",
      userName: user.full_name,
      userId: user.id,
      role: user.role,
      dashboardUrl,
      professionalId,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE BOOKING
app.post("/api/bookings", async (req, res) => {
  const { email, service_id, date, time, price } = req.body;

  try {
    const [[user]] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (!user) return res.status(404).json({ error: "User not found" });

    const [[pro]] = await db.query(
      "SELECT id FROM users WHERE role = 'professional' AND service_id = ? LIMIT 1",
      [service_id],
    );
    if (!pro) {
      return res
        .status(404)
        .json({ error: "No professional found for this service" });
    }

    const [[service]] = await db.query(
      "SELECT title FROM services WHERE id = ?",
      [service_id],
    );
    if (!service) {
      return res.status(500).json({ error: "Service not found" });
    }

    await db.query(
      `INSERT INTO bookings (user_id, professional_id, service_id, booking_date, booking_time, price, service_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.id, pro.id, service_id, date, time, price, service.title],
    );

    res.status(200).json({
      message: "Booking successful and assigned to a professional!",
    });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ error: "Error saving booking" });
  }
});

// GET BOOKINGS + FEEDBACK
// Backend (Node.js with MySQL)
app.get("/api/user-bookings/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Query the database
    const [bookings] = await db.query(
      `
      SELECT
      b.id,
      b.booking_date,
      b.booking_time,
      b.price,
      b.created_at,
      b.status,
      s.title AS service_name,
      f.message,
      f.rating AS feedback_rating,
      p.full_name AS professional_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN feedback f ON b.id = f.booking_id
      LEFT JOIN users p ON b.professional_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE u.email = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC;`,
      [email],
    );

    // Check if bookings are found
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this email." });
    }

    // Send the bookings data in the response
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Error fetching bookings.");
  }
});

// SUBMIT FEEDBACK
app.post("/api/submit-feedback", async (req, res) => {
  const { booking_id, message, rating } = req.body;
  if (!booking_id || !message || rating === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO feedback (booking_id, message, rating) VALUES (?, ?, ?)",
      [booking_id, message, rating],
    );
    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET SERVICES
app.get("/api/services", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM services");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// GET REQUESTS BY SERVICE
app.get("/api/requests/:service_id", async (req, res) => {
  const { service_id } = req.params;
  try {
    const [results] = await db.query(
      `SELECT b.id, u.full_name, u.email, b.booking_date, b.booking_time, b.price, s.title AS service_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services s ON b.service_id = s.id
       WHERE b.service_id = ? AND b.status = 'pending'`,
      [service_id],
    );
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE REQUEST STATUS
app.post("/api/update-request-status", async (req, res) => {
  const { booking_id, status } = req.body;
  try {
    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [
      status,
      booking_id,
    ]);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// REJECT AND REASSIGN BOOKING
app.post("/api/bookings/:id/reject", async (req, res) => {
  const bookingId = req.params.id;
  const { professional_id } = req.body;

  try {
    // Step 1: Find the booking
    const [bookingRows] = await db.query(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId],
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingRows[0];

    // Step 2: Update original booking status to 'rejected'
    await db.query("UPDATE bookings SET status = 'rejected' WHERE id = ?", [
      bookingId,
    ]);

    // Step 3: Find another professional for the same service (excluding the one who rejected it)
    const [otherPros] = await db.query(
      `SELECT id FROM users 
       WHERE role = 'professional' 
       AND service_id = ? 
       AND id != ? 
       LIMIT 1`,
      [booking.service_id, professional_id],
    );

    if (otherPros.length > 0) {
      const newProfessionalId = otherPros[0].id;

      // Step 4: Update the professional_id in the bookings table
      await db.query(
        "UPDATE bookings SET professional_id = ?, status = 'pending' WHERE id = ?",
        [newProfessionalId, bookingId],
      );

      // Optional: Also log it in service_requests table if you're tracking reassignments
      await db.query(
        `INSERT INTO service_requests (booking_id, professional_id, status)
         VALUES (?, ?, 'pending')`,
        [bookingId, newProfessionalId],
      );

      return res.status(200).json({
        message: "Request rejected and reassigned to another professional.",
      });
    } else {
      return res.status(200).json({
        message: "Request rejected. No other professional available.",
      });
    }
  } catch (err) {
    console.error("Reject booking error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error while rejecting booking." });
  }
});

// Accept a service request
app.post("/api/bookings/:id/accept", async (req, res) => {
  const bookingId = req.params.id;
  const { professional_id } = req.body; // This is the ID of the professional accepting the booking
  console.log("Received professional_id:", professional_id);
  try {
    // Step 1: Find the original booking details
    const [bookingRows] = await db.query(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId],
    );
    const booking = bookingRows[0];
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Step 2: Check if the booking is already accepted or rejected
    if (booking.status === "accepted") {
      return res
        .status(400)
        .json({ message: "Booking has already been accepted" });
    } else if (booking.status === "rejected") {
      return res.status(400).json({ message: "Booking has been rejected" });
    }

    // Step 3: Update booking status to "accepted" and assign the professional
    await db.query(
      "UPDATE bookings SET status = ?, professional_id = ? WHERE id = ?",
      ["accepted", professional_id, bookingId],
    );

    // Optional: Notify the customer and professional via email, socket, etc.

    res.status(200).json({
      message: "Booking successfully accepted by the professional.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Fetch all pending requests for a specific professional
// routes/requests.js or directly in your server.js/app.js
app.get("/api/professionals/:professional_id/requests", async (req, res) => {
  const professionalId = req.params.professional_id;

  const query = `
    SELECT 
      b.id, 
      u.full_name AS customer_name, 
      u.email AS customer_email, 
      b.booking_date, 
      b.booking_time, 
      b.price, 
      s.title AS service_name, 
      b.status
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
    WHERE b.professional_id = ? AND b.status = 'pending'
  `;

  try {
    const [results] = await db.query(query, [professionalId]);
    console.log("Fetched results from DB:", results);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

app.get("/api/professional/:professional_id/bookings", async (req, res) => {
  const professionalId = req.params.professional_id;

  try {
    const [rows] = await db.query(
      `SELECT 
        b.id AS bookingId,
        b.status,
        b.booking_date,
        b.booking_time,
        f.rating,  -- Get the rating from the feedback table
        u.full_name AS customerName,
        u.address AS customerAddress,
        s.title AS serviceName
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      LEFT JOIN feedback f ON b.id = f.booking_id  -- Join the feedback table
      WHERE b.professional_id = ? AND b.status IN ('accepted', 'done');`,
      [professionalId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/user-bookings/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Received request for userId:", userId);
  try {
    const query = `
      SELECT
        b.id,
        b.booking_date,
        b.booking_time,
        b.price,
        b.created_at,
        b.status,
        s.title AS service_name,
        f.message,
        f.rating AS feedback_rating,
        p.full_name AS professional_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN feedback f ON b.id = f.booking_id
      LEFT JOIN users p ON b.professional_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC;
    `;
    const [rows] = await db.query(query, [userId]);

    console.log("Bookings:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.put(
  "/api/professional/:professional_id/booking/:booking_id/finish",
  async (req, res) => {
    const { professional_id, booking_id } = req.params;

    try {
      // Update the booking status to 'done'
      const [result] = await db.query(
        `UPDATE bookings 
      SET status = 'done' 
      WHERE id = ? AND professional_id = ?`,
        [booking_id, professional_id],
      );

      // If no rows were updated, send a 404
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Booking not found or already finished." });
      }

      // Respond with success
      res.status(200).json({ message: "Booking marked as done" });
    } catch (err) {
      console.error("Error updating booking status:", err);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  },
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
