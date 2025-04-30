import express from "express";
import cors from "cors";
// import pool from "./db";
// import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running.....");
});
