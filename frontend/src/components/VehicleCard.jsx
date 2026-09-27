import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      {/* Vehicle Image */}
      <div className="vehicle-image-wrapper">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="vehicle-card-image"
        />

        <span
          className={`vehicle-status ${
            vehicle.status === "available"
              ? "available"
              : "unavailable"
          }`}
        >
          {vehicle.status === "available"
            ? "Available"
            : "Unavailable"}
        </span>
      </div>

      {/* Vehicle Information */}
      <div className="vehicle-info">
        <div className="vehicle-title-row">
          <div>
            <h3>{vehicle.name}</h3>
            <p className="vehicle-brand">
              {vehicle.brand} • {vehicle.category}
            </p>
          </div>

          <div className="vehicle-price">
            <strong>₹{vehicle.price_per_day}</strong>
            <span>/day</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="vehicle-specs-small">
          <span>⚙️ {vehicle.transmission}</span>
          <span>⛽ {vehicle.fuel_type}</span>
          <span>👥 {vehicle.seats} Seats</span>
        </div>

        {/* Button */}
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="details-btn"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard;