import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "postgres1234",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// handling the default "/" route 
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mybooks ORDER BY rating DESC ");
    const bookData = result.rows;
    console.log(bookData);

    res.render("index.ejs", {
      bookData: bookData,
    });
  } catch (error) {
    console.log("could not execute query", error);
  }
});

// handling the sort route when a user hits the go button 
app.post("/sort", async (req, res) => {
  const sortOption = req.body.sortOption;
  console.log(sortOption);

  try {
    // Handling different sort options based on sortOption value
    let query;
    switch (sortOption) {
      case "rating":
        query = "SELECT * FROM mybooks ORDER BY rating DESC";
        break;
      case "date":
        query = "SELECT * FROM mybooks ORDER BY review_date DESC";
        break;
      case "title":
        query = "SELECT * FROM mybooks ORDER BY book_name ASC";
        break;
      default:
        query = "SELECT * FROM mybooks";
    }

    const result = await db.query(query);
    const bookData = result.rows;

    res.render("index.ejs", {
      bookData: bookData,
    });
  } catch (error) {
    console.log("Could not execute query: ", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
