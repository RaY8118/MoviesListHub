import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieFetcher = () => {
  const [searchTerm, setSearchTerm] = useState("fleabag");
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
            const detailsResponse = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setMovies([]); 
      setPage(1);     
      fetchMovies(1); 
    }
  };

  return (
    <div className="p-4 bg-indigo-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Movie List</h1>

<div className="flex justify-center items-center space-x-2 mb-6">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleKeyPress}
    className="border border-gray-300 rounded-lg p-3 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
    placeholder="Search for movies..."
  />
  <button
    className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold shadow-md hover:bg-blue-600 transition duration-200"
    onClick={() => {
      setMovies([]);
      setPage(1);     
      fetchMovies(1);
    }}
  >
    Search
  </button>
</div>


      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="movie-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 mt-8">
  {movies.map((movie) => (
    <div
      key={movie.imdbID}
      className="bg-white shadow-lg rounded-lg overflow-hidden p-4 flex transition-all hover:scale-105 hover:shadow-xl"
    >
      {/* Movie Poster on the Left */}
      {movie.Poster && movie.Poster !== "N/A" && (
        <img
          src={movie.Poster}
          alt={`${movie.Title} Poster`}
          className="w-1/3 h-auto object-cover rounded-lg"
        />
      )}

      {/* Movie Details on the Right */}
      <div className="pl-6 flex-grow space-y-3">
        {/* Title and Ratings */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-gray-900">{movie.Title}</h3>
          <div className="text-sm text-yellow-500 font-semibold">
            IMDb: {movie.imdbRating || "N/A"} / 10
          </div>
        </div>

        {/* Year, Rated, Genre */}
        <p className="text-sm text-gray-500">
          {movie.Year} | Rated: {movie.Rated} | Genre: {movie.Genre || "N/A"}
        </p>

        {/* Plot */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {movie.Plot || "Plot not available."}
        </p>

        {/* Director, Runtime */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-semibold">Director:</span> {movie.Director || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Runtime:</span> {movie.Runtime || "N/A"}
          </p>
        </div>

        {/* IMDb Rating and Rotten Tomatoes */}
        <div className="flex items-center justify-between">
          <div className="text-red-600 font-semibold text-sm">
            Rotten Tomatoes: {movie.Ratings.find((rating) => rating.Source === "Rotten Tomatoes")?.Value || "N/A"}
          </div>
        </div>

        {/* Awards */}
        {movie.Awards && movie.Awards !== "N/A" && (
          <p className="mt-2 text-xs text-green-600 font-semibold">
            Awards: {movie.Awards}
          </p>
        )}
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default MovieFetcher;
