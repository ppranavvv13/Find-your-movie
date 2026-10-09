
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const message = document.getElementById("message");
const grid = document.getElementById("movie-grid");
const dialog = document.getElementById("movie-dialog");
const details = document.getElementById("movie-details");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  grid.replaceChildren();
  message.textContent = "Searching movies...";

  try {
    const response = await fetch(
      `/api/movies?title=${encodeURIComponent(title)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Search failed.");
    }

    message.textContent = `Found ${data.length} movies.`;

    data.forEach((movie) => {
      const card = document.createElement("article");
      card.className = "movie-card";

      const poster = document.createElement("img");
      poster.alt = `${movie.Title} poster`;
      poster.loading = "lazy";
      poster.src =
        movie.Poster && movie.Poster !== "N/A"
          ? movie.Poster
          : "https://placehold.co/300x450?text=No+Poster";

      const info = document.createElement("div");
      info.className = "movie-info";

      const heading = document.createElement("h2");
      heading.textContent = movie.Title;

      const year = document.createElement("p");
      year.textContent = `${movie.Year} · ${movie.Type}`;

      info.append(heading, year);
      card.append(poster, info);

      card.addEventListener("click", () => loadDetails(movie.imdbID));

      grid.append(card);
    });

  } catch (error) {
    message.textContent = error.message;
  }
});

async function loadDetails(id) {
  details.textContent = "Loading movie details...";
  dialog.showModal();

  try {
    const response = await fetch(`/api/movies/${encodeURIComponent(id)}`);
    const movie = await response.json();

    if (!response.ok) {
      throw new Error(movie.error || "Could not load movie.");
    }

    details.replaceChildren();

    const poster = document.createElement("img");
    poster.alt = `${movie.Title} poster`;
    poster.src =
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://placehold.co/300x450?text=No+Poster";

    const heading = document.createElement("h2");
    heading.textContent = movie.Title;

    const facts = document.createElement("p");
    facts.textContent =
      `${movie.Year} · ${movie.Runtime} · IMDb ${movie.imdbRating}`;

    const plot = document.createElement("p");
    plot.textContent = movie.Plot;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${movie.Genre}`;

    const director = document.createElement("p");
    director.textContent = `Director: ${movie.Director}`;

    details.append(poster, heading, facts, genre, director, plot);

  } catch (error) {
    details.textContent = error.message;
  }
}

document.getElementById("close-dialog").addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
