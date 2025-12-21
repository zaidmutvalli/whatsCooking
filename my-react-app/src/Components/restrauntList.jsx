//This file will be used to structure the restaurants list and information
export default function RestaurantList({ name, image, rating }) {
    return (
      <article className="restaurant-card">
        <img className="restaurant-image" src={image} alt={name} />
        <h2 className="restaurant-name">{name}</h2>
        <div className="restaurant-rating">{rating}</div>
      </article>
    )
  }
  