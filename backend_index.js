const express = require("express");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "database-1.chkwucae6la5.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "12345678",
  port: 3306,
  database: "cn",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

const app = express();

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle form submissions
app.post("/api/user", (req, res) => {
  const { name, email, message } = req.body;

  const sqlQuery =
    "INSERT INTO Persons (name, email, message) VALUES (?, ?, ?)";
  connection.query(sqlQuery, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error executing SQL query: " + err.stack);
      res.status(500).send(err);
      return;
    }
    console.log("Form data inserted successfully.");
    res.send("Form submitted successfully.");
  });
});

app.get("/data", (req, res) => {
  const sqlQuery = "SELECT * FROM Persons";
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error executing SQL query: " + err.stack);
      res.status(500).send(err);
      return;
    }
    res.send(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
