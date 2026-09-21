import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";

const API_URL = "http://10.149.188.223:5000";

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/vehicles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        return response.json();
      })
      .then((data) => {
        setVehicles(data.slice(0, 3));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Rent a Ride, Start Your Journey 🚗</h1>

          <p>
            Find the perfect vehicle for your trip at affordable prices.
          </p>

          <Link to="/vehicles" className="hero-btn">
            Browse Vehicles
          </Link>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Vehicles</h2>

        {loading ? (
          <p>Loading vehicles...</p>
        ) : (
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;