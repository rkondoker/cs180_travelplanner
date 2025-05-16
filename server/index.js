import express from "express";
import cors from "cors"
import pool from "./db.js";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendMessages = () => {
    res.write(`data: ${messages.join("\\n")}\n\n`);
  };

  // Immediately send the current messages
  sendMessages();

  const interval = setInterval(sendMessages, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

app.get("/", (req, res) => {
  const newMessage = `Line ${messages.length + 1}`;
  messages.push(newMessage);
  res.send("Message added");
});
/*
app.post("/trips", async (req, res) => {
  const { userId, title, startDate, endDate, activities, destination } = req.body;
  try {
    // First create the trip
    const tripResult = await pool.query(
      "INSERT INTO trips (user_id, title, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, startDate, endDate]
    );

    const tripId = tripResult.rows[0].trip_id;

    // If there are activities, insert them
    if (activities && activities.length > 0) {
      for (const activity of activities) {
        await pool.query(
          "INSERT INTO activities (trip_id, name) VALUES ($1, $2)",
          [tripId, activity]
        );
      }
    }

    res.json(tripResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});
*/

app.post("/trips", async (req, res) => {
  const { title, startDate, endDate, activities, destination } = req.body;
  try {
    // First, get or create a default user
    const defaultUserResult = await pool.query(
      "INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING user_id",
      ['guest@example.com', 'Guest', 'User', 'defaultpassword']
    );
    
    const userId = defaultUserResult.rows[0].user_id;

    // Create the trip with the default user
    const tripResult = await pool.query(
      "INSERT INTO trips (user_id, title, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, startDate, endDate]
    );

    const tripId = tripResult.rows[0].trip_id;

    // If there are activities, insert them
    if (activities && activities.length > 0) {
      for (const activity of activities) {
        await pool.query(
          "INSERT INTO activities (trip_id, name) VALUES ($1, $2)",
          [tripId, activity]
        );
      }
    }

    res.json(tripResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(8080, () => {
  console.log("Server listening on port 8080");
});




/*
app.listen(5000, () => {
  console.log("Server is running.....");
});
*/
