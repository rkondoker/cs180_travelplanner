import express from "express";
import cors from "cors";
import pool from "./db";
import Trip from "./models/Trip.js";
import Activity from "./models/Activity.js";
// import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendMessages = () => {
    res.write(`data: ${messages.join("\n")}

`);
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

// trip via trip id (not working)
app.get("/trips/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await pool.query("SELECT * FROM trips WHERE trip_id = $1", [tripId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }
    const trip = Trip.fromDbRow(result.rows[0]);
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// activities for a trip (not working)
app.get("/trips/:tripId/activities", async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await pool.query("SELECT * FROM activities WHERE trip_id = $1", [tripId]);
    const activities = result.rows.map(Activity.fromDbRow);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
