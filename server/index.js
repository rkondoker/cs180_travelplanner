import express from "express";
import cors from "cors";
// import pool from "./db";
// import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendMessages = () => {
    res.write(`data: ${messages.join('\\n')}\n\n`);
  };

  // Immediately send the current messages
  sendMessages();

  const interval = setInterval(sendMessages, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

app.get('/', (req, res) => {
  const newMessage = `Line ${messages.length + 1}`;
  messages.push(newMessage);
  res.send('Message added');
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

/*
app.listen(5000, () => {
  console.log("Server is running.....");
});
*/
