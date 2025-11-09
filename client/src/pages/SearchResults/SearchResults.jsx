import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import * as restaurantService from "../../services/restaurantService";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchRestaurants();
    }
  }, [query]);

  const searchRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantService.searchRestaurants(query);
      setResults(data.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-results">
      <div className="search-results__container">
        <h1 className="search-results__title">
          Search Results for "{query}"
        </h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : results.length === 0 ? (
          <div className="search-results__empty">
            <p>No results found for "{query}"</p>
            <p className="search-results__empty-hint">
              Try searching for a different restaurant or cuisine type
            </p>
          </div>
        ) : (
          <>
            <p className="search-results__count">
              Found {results.length} {results.length === 1 ? "restaurant" : "restaurants"}
            </p>
            <div className="search-results__grid">
              {results.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;