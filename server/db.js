import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cs180-travel-planner",
  password: "",
  port: 5432,
});

export default pool;
