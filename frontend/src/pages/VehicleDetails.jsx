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
        <h1>Loading vehicle...</h1>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="page">
        <h1>Vehicle Not Found</h1>
        <Link to="/vehicles">Back to Vehicles</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="details-container">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="details-image"
        />

        <div className="details-info">
          <h1>
            {vehicle.brand} {vehicle.name}
          </h1>

          <h2>₹{vehicle.price_per_day} / day</h2>

          <div className="vehicle-specs">
            <p>
              <strong>Model:</strong> {vehicle.model}
            </p>

            <p>
              <strong>Category:</strong> {vehicle.category}
            </p>

            <p>
              <strong>Fuel:</strong> {vehicle.fuel_type}
            </p>

            <p>
              <strong>Transmission:</strong> {vehicle.transmission}
            </p>

            <p>
              <strong>Seats:</strong> {vehicle.seats}
            </p>

            <p>
              <strong>Status:</strong> {vehicle.status}
            </p>
          </div>

          <div className="booking-form">
            <label>Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label>End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button
  onClick={handleBooking}
  className="book-btn"
  disabled={bookingLoading || vehicle.status !== "available"}
>
  {vehicle.status !== "available"
    ? "Vehicle Unavailable"
    : bookingLoading
    ? "Booking..."
    : "Book Now"}
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;