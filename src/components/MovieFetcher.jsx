import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const MovieFetcher = () => {
  const [searchTerm, setSearchTerm] = useState("inception");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "1df6f2ae";

  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    setError(null);

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&page=${pageNumber}`;
    console.log("Fetching:", url); // Log the URL

    try {
      const response = await axios.get(url);
      console.log("Response:", response.data); // Log the response

      if (response.data.Response === "True") {
        setMovies((prevMovies) => [...prevMovies, ...response.data.Search]);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      console.error("Fetch error:", err); // Log the error for debugging
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  return (
    <div>
      <h1>Movie List</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for movies..."
      />
      <button
        onClick={() => {
          setMovies([]);
          setPage(1);
          fetchMovies(1);
        }}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {movies.map((movie) => (
          <li key={movie.imdbID}>
            {movie.Title} ({movie.Year})
          </li>
        ))}
      </ul>

      <button onClick={handleLoadMore} disabled={loading}>
        Load More
      </button>
    </div>
  );
};

export default MovieFetcher;
