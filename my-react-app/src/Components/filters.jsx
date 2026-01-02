export default function Filters({ onSelectFilter }) {
  const options = ["All", "Restaurants", "Cafes", "Fast Food"];

  return (
    <div className="filters">
      {options.map((opt) => (
        <button key={opt} onClick={() => onSelectFilter(opt)} className="filter-button">
          {opt}
        </button>
      ))}
    </div>
  );
}
