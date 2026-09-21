import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="vehicle-card-image"
      />

      <div className="vehicle-info">
        <h3>{vehicle.name}</h3>

        <p>{vehicle.brand}</p>

        <p>Category: {vehicle.category}</p>

        <h4>₹{vehicle.price_per_day}/day</h4>

        <Link to={`/vehicles/${vehicle.id}`} className="details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard;