import { useEffect, useState } from "react";

const API_URL = "http://10.149.188.223:5000";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/bookings/user/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        return response.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [user]);
  const payNow = async (bookingId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/payment`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Payment failed.");
      return;
    }

    alert("Payment successful!");

    // Refresh the bookings list
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, payment_status: "paid" }
          : booking
      )
    );
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the backend.");
  }
};

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to cancel booking.");
        return;
      }

      alert("Booking cancelled successfully.");

      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the backend.");
    }
  };

  if (!user) {
    return (
      <div className="page">
        <h1>My Bookings</h1>
        <p>Please login to view your bookings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <h1>My Bookings</h1>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <h2>No bookings yet</h2>
          <p>Book a vehicle and your booking will appear here.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <h2>
                {booking.vehicle_name || booking.name || "Vehicle"}
              </h2>

              <p>
  <strong>Start Date:</strong>{" "}
  {new Date(booking.start_date).toISOString().split("T")[0]}
</p>

<p>
  <strong>End Date:</strong>{" "}
  {new Date(booking.end_date).toISOString().split("T")[0]}
</p>

              <p>
                <strong>Total Days:</strong> {booking.total_days}
              </p>

              <p>
                <strong>Total Amount:</strong> ₹{booking.total_amount}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status">
                  {booking.status || "Confirmed"}
                </span>
              </p>
              {booking.payment_status !== "paid" && (
  <button
    className="pay-btn"
    onClick={() => payNow(booking.id)}
  >
    Pay Now
  </button>
)}

              <button
                className="cancel-btn"
                onClick={() => cancelBooking(booking.id)}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;