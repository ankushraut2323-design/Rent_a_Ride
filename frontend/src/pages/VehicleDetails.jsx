import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://10.149.188.223:5000";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/vehicles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle");
        }

        return response.json();
      })
      .then((data) => {
        setVehicle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: savedUser.id,
          vehicle_id: vehicle.id,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Booking failed.");
        return;
      }

      alert(
        `Booking successful!\nTotal Days: ${data.totalDays}\nTotal Amount: ₹${data.totalAmount}`
      );

      navigate("/bookings");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the backend.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading vehicle...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="page">
        <div className="empty-bookings">
          <h2>Vehicle Not Found</h2>
          <p>The vehicle could not be loaded.</p>

          <br />

          <Link to="/vehicles" className="hero-btn">
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = vehicle.status === "available";

  return (
    <div className="page">
      {/* Back link */}
      <Link to="/vehicles" className="back-link">
        ← Back to Vehicles
      </Link>

      <div className="details-container">
        {/* LEFT SIDE */}
        <div>
          <div className="details-image-wrapper">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="details-image"
            />

            <span
              className={`details-status ${
                isAvailable ? "available" : "unavailable"
              }`}
            >
              {isAvailable ? "● Available" : "● Unavailable"}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="details-info">
          <p className="section-label">
            {vehicle.category}
          </p>

          <h1>
            {vehicle.brand} {vehicle.name}
          </h1>

          <p className="details-model">
            {vehicle.model}
          </p>

          <div className="details-price">
            <strong>₹{vehicle.price_per_day}</strong>
            <span> / day</span>
          </div>

          {/* Specifications */}
          <div className="vehicle-specs">
            <div className="detail-spec">
              <span className="detail-spec-icon">⚙️</span>
              <div>
                <small>Transmission</small>
                <strong>{vehicle.transmission}</strong>
              </div>
            </div>

            <div className="detail-spec">
              <span className="detail-spec-icon">⛽</span>
              <div>
                <small>Fuel Type</small>
                <strong>{vehicle.fuel_type}</strong>
              </div>
            </div>

            <div className="detail-spec">
              <span className="detail-spec-icon">👥</span>
              <div>
                <small>Seats</small>
                <strong>{vehicle.seats} People</strong>
              </div>
            </div>

            <div className="detail-spec">
              <span className="detail-spec-icon">🚗</span>
              <div>
                <small>Category</small>
                <strong>{vehicle.category}</strong>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="booking-form">
            <h2>Book This Vehicle</h2>

            <p className="booking-description">
              Select your rental dates to continue.
            </p>

            <label>Pick-up Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label>Return Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button
              onClick={handleBooking}
              className="book-btn"
              disabled={!isAvailable || bookingLoading}
            >
              {!isAvailable
                ? "Vehicle Unavailable"
                : bookingLoading
                ? "Processing Booking..."
                : "Book Now →"}
            </button>

            <p className="booking-note">
              🔒 Secure booking • No hidden charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;