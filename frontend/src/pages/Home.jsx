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
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-small-text">
            YOUR JOURNEY STARTS HERE
          </p>

          <h1>
            Find Your
            <br />
            Perfect Ride.
          </h1>

          <p>
            Simple. Fast. Affordable.
            <br />
            Choose your vehicle and start your journey.
          </p>

          <div className="hero-actions">
            <Link to="/vehicles" className="hero-btn">
              Browse Vehicles →
            </Link>

            <Link to="/register" className="hero-secondary-btn">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="feature-item">
          <div className="feature-icon">🚗</div>

          <div>
            <h3>Wide Selection</h3>
            <p>Choose from multiple vehicles.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">💰</div>

          <div>
            <h3>Affordable Prices</h3>
            <p>Simple and transparent pricing.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">⚡</div>

          <div>
            <h3>Easy Booking</h3>
            <p>Book your ride in minutes.</p>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="featured">
        <div className="section-heading">
          <div>
            <p className="section-label">OUR FLEET</p>

            <h2>Featured Vehicles</h2>
          </div>

          <Link to="/vehicles" className="view-all-btn">
            View All →
          </Link>
        </div>

        {loading ? (
          <p>Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p>No vehicles available right now.</p>
        ) : (
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <p className="section-label">READY TO GO?</p>

          <h2>
            Choose your ride and start your journey.
          </h2>

          <p>
            Browse our available vehicles and find the
            one that fits your journey.
          </p>
        </div>

        <Link to="/vehicles" className="hero-btn">
          Explore Vehicles →
        </Link>
      </section>
    </div>
  );
}

export default Home;