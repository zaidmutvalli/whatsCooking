export default function Filters() {
    const options = ["Restaurants", "Cafes", "Bars", "Dog Friendly", "Seafood", "Fast Food"];
    
    return (
      <div className="filters">
        {options.map((opt, i) => (
          <button key={i} className="filter-button">{opt}</button>
        ))}
      </div>
    )
  }
  