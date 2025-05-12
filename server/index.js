import express from "express";
import cors from "cors";
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

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(400)
        .json({
          message: "The email or password is incorrect, please try again.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res
        .status(400)
        .json({
          message: "The email or password is incorrect, please try again.",
        });
    }

    const { first_name, last_name, joined_on } = user.rows[0];
    const returnUser = { email, first_name, last_name, joined_on };
    res.json(returnUser);
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
