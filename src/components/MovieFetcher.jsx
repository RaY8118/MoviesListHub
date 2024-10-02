import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieFetcher = () => {
  const [searchTerm, setSearchTerm] = useState("iron man");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = "1df6f2ae"; 

  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    setError(null);

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&page=${pageNumber}`;
    console.log("Fetching:", url);

    try {
      const response = await axios.get(url);
      console.log("Response:", response.data);

      if (response.data.Response === "True") {
        const newMovies = response.data.Search;

        const detailedMovies = await Promise.all(
          newMovies.map(async (movie) => {
            const detailsResponse = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
            return detailsResponse.data;
          })
        );

        setMovies((prevMovies) => [...prevMovies, ...detailedMovies]);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
    <div className="p-4 bg-pink-500">
      <h1 className="text-2xl font-bold">Movie List</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 mt-2"
        placeholder="Search for movies..."
      />
      <button
        className="ml-2 bg-blue-500 text-white rounded-lg p-2"
        onClick={() => {
          setMovies([]);
          setPage(1);
          fetchMovies(1);
        }}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="movie-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-gray-100 border border-gray-300 rounded-lg p-4 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{movie.Title}</h3>
            <p className="text-gray-600">{movie.Year}</p>
            {movie.Poster && movie.Poster !== "N/A" && (
              <img src={movie.Poster} alt={`${movie.Title} Poster`} className="mt-2 w-full rounded" />
            )}
            <p className="mt-2">{movie.Plot || "Plot not available."}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 bg-blue-500 text-white rounded-lg p-2" onClick={handleLoadMore} disabled={loading}>
        Load More
      </button>
    </div>
  );
};

export default MovieFetcher;
