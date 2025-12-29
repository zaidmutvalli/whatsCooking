import { useEffect, useMemo, useState } from "react";
import "../styles/mainPage.css";
import Filters from "../Components/filters";
import RestaurantList from "../Components/restrauntList";

export default function MainPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [restaurants, setRestaurants] = useState([]);
  const [cafes, setCafes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

       
        const [restaurantsData, cafesData] = await Promise.all([
          fetchTrendingRestaurants(),
          fetchTrendingCafes(),
        ]);

        setRestaurants(restaurantsData);
        setCafes(cafesData);
      } catch (e) {
        setError(e.message || "Something went wrong");

       
        setRestaurants([
          { name: "Restaurant 1", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ★ ☆" },
        ]);
        setCafes([
          { name: "Cafe 1", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ☆ ☆" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const showRestaurants = useMemo(() => {
    if (selectedFilter === "All" || selectedFilter === "Restaurants") return restaurants;
    return [];
  }, [selectedFilter, restaurants]);

  const showCafes = useMemo(() => {
    if (selectedFilter === "All" || selectedFilter === "Cafes") return cafes;
    return [];
  }, [selectedFilter, cafes]);

  return (
    <div>
      <Filters onSelectFilter={setSelectedFilter} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ marginTop: "10px" }}>Error: {error}</p>}

      {!loading && (selectedFilter === "All" || selectedFilter === "Restaurants") && (
        <>
          <h2>Trending Restaurants</h2>
          <section className="restaurant-list">
            {showRestaurants.map((r, i) => (
              <RestaurantList
                key={`r-${i}`}
                name={r.name}
                image={r.image}
                rating={r.rating}
              />
            ))}
          </section>
        </>
      )}

      {!loading && (selectedFilter === "All" || selectedFilter === "Cafes") && (
        <>
          <h2>Trending Cafes</h2>
          <section className="restaurant-list">
            {showCafes.map((c, i) => (
              <RestaurantList
                key={`c-${i}`}
                name={c.name}
                image={c.image}
                rating={c.rating}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
