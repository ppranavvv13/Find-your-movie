
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Put your OMDb API key here
const API_KEY = "8b74b33d";

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/movies", async (req, res) => {
  try {
    const title = req.query.title?.trim();

    if (!title) {
      return res.status(400).json({
        error: "Please enter a movie title."
      });
    }

    const url =
      `https://www.omdbapi.com/?apikey=${API_KEY}` +
      `&s=${encodeURIComponent(title)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.Response === "False") {
      return res.status(404).json({
        error: data.Error || "No movies found."
      });
    }

    res.json(data.Search || []);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to search movies."
    });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^tt\d+$/.test(id)) {
      return res.status(400).json({
        error: "Invalid movie ID."
      });
    }

    const url =
      `https://www.omdbapi.com/?apikey=${API_KEY}` +
      `&i=${encodeURIComponent(id)}&plot=full`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.Response === "False") {
      return res.status(404).json({
        error: data.Error || "Movie details not found."
      });
    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to load movie details."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Movie Explorer running at http://localhost:${PORT}`);
});
