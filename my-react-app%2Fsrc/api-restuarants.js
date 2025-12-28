export async function fetchRestaurants(filter = "Restaurants") {

  const data = [
    { name: "Mock Restaurant 1", rating: 4.2, address: "Manchester", image: "https://via.placeholder.com/150" },
    { name: "Mock Restaurant 2", rating: 3.9, address: "Oxford Rd", image: "https://via.placeholder.com/150" },
  ];


  if (filter === "Cafes") {
    return [
      { name: "Mock Cafe 1", rating: 4.5, address: "Northern Quarter", image: "https://via.placeholder.com/150" },
    ];
  }

  return data;
}
