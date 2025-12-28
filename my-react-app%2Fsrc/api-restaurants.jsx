
const BASE_URL = "http://localhost:3000"; 


export async function fetchTrendingRestaurants() {
  const res = await fetch(`${BASE_URL}/restaurants/trending`);
  if (!res.ok) throw new Error("Failed to load restaurants");
  return res.json();
}

export async function fetchTrendingCafes() {
  const res = await fetch(`${BASE_URL}/cafes/trending`);
  if (!res.ok) throw new Error("Failed to load cafes");
  return res.json();
}
