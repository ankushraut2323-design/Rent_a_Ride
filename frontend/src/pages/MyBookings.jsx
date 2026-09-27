import { useEffect, useState } from "react";

const API_URL = "http://10.149.188.223:5000";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
  }, []);

  const payNow = async () => {
    if (!selectedBooking) {
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${selectedBooking.id}/payment`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Payment failed.");
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? {
                ...booking,
                payment_status: "paid",
              }
            : booking
        )
      );

      setPaymentSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the backend.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const closePaymentModal = () => {
    setSelectedBooking(null);
    setPaymentSuccess(false);
    setPaymentMethod("UPI");
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

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking.id !== bookingId
        )
      );

      alert("Booking cancelled successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the backend.");
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="empty-bookings">
          <div className="booking-empty-icon">🚗</div>

          <h2>Login Required</h2>

          <p>
            Please login to view your bookings.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <div className="booking-loading">
          <h1>My Bookings</h1>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <div className="booking-page-header">
        <div>
          <p className="section-label">
            YOUR JOURNEY
          </p>

          <h1>My Bookings</h1>

          <p className="page-description">
            Manage your vehicle rentals and payments.
          </p>
        </div>

        <div className="booking-count">
          <strong>{bookings.length}</strong>
          <span>Bookings</span>
        </div>
      </div>

      {/* BOOKINGS */}
      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <div className="booking-empty-icon">
            🚘
          </div>

          <h2>No bookings yet</h2>

          <p>
            You haven't booked a vehicle yet.
            Start your journey today.
          </p>
        </div>
      ) : (
        <div className="bookings-list">

          {bookings.map((booking) => (
            <div
              className="booking-card"
              key={booking.id}
            >

              {/* CARD HEADER */}
              <div className="booking-card-header">

                <div>
                  <p className="booking-number">
                    BOOKING #{booking.id}
                  </p>

                  <h2>
                    {booking.vehicle_name ||
                      booking.name ||
                      "Vehicle"}
                  </h2>
                </div>

                <span className="status">
                  {booking.status || "Confirmed"}
                </span>

              </div>

              {/* BOOKING INFO */}
              <div className="booking-info-grid">

                <div className="booking-info-item">
                  <span>📅</span>

                  <div>
                    <small>Pick-up</small>

                    <strong>
                      {new Date(
                        booking.start_date
                      )
                        .toISOString()
                        .split("T")[0]}
                    </strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <span>📅</span>

                  <div>
                    <small>Return</small>

                    <strong>
                      {new Date(
                        booking.end_date
                      )
                        .toISOString()
                        .split("T")[0]}
                    </strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <span>⏱️</span>

                  <div>
                    <small>Total Days</small>

                    <strong>
                      {booking.total_days} Days
                    </strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <span>💰</span>

                  <div>
                    <small>Total Amount</small>

                    <strong>
                      ₹{booking.total_amount}
                    </strong>
                  </div>
                </div>

              </div>

              {/* PAYMENT */}
              <div className="booking-payment-row">

                <div>
                  <small>Payment Status</small>

                  {booking.payment_status === "paid" ? (
                    <p className="paid-status">
                      ✓ Payment Paid
                    </p>
                  ) : (
                    <p className="unpaid-status">
                      Payment Pending
                    </p>
                  )}
                </div>

                <div className="booking-actions">

                  {booking.payment_status !== "paid" && (
                    <button
                      className="pay-btn"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setPaymentSuccess(false);
                      }}
                    >
                      Pay ₹{booking.total_amount}
                    </button>
                  )}

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      cancelBooking(booking.id)
                    }
                  >
                    Cancel Booking
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* PAYMENT MODAL */}
      {selectedBooking && (
        <div className="payment-overlay">

          <div className="payment-modal">

            {!paymentSuccess ? (
              <>
                <button
                  className="payment-close"
                  onClick={closePaymentModal}
                >
                  ✕
                </button>

                <div className="payment-icon">
                  💳
                </div>

                <p className="section-label">
                  SECURE PAYMENT
                </p>

                <h2>Complete Payment</h2>

                <p className="payment-booking-name">
                  {selectedBooking.vehicle_name ||
                    selectedBooking.name ||
                    "Vehicle"}
                </p>

                <div className="payment-amount">
                  <span>Total Amount</span>

                  <strong>
                    ₹{selectedBooking.total_amount}
                  </strong>
                </div>

                <h3>Choose Payment Method</h3>

                <div className="payment-options">

                  <label
                    className={
                      paymentMethod === "UPI"
                        ? "payment-option selected"
                        : "payment-option"
                    }
                  >
                    <input
                      type="radio"
                      value="UPI"
                      checked={
                        paymentMethod === "UPI"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span>📱</span>

                    <div>
                      <strong>UPI</strong>
                      <small>Pay using UPI</small>
                    </div>
                  </label>

                  <label
                    className={
                      paymentMethod === "Card"
                        ? "payment-option selected"
                        : "payment-option"
                    }
                  >
                    <input
                      type="radio"
                      value="Card"
                      checked={
                        paymentMethod === "Card"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span>💳</span>

                    <div>
                      <strong>Card</strong>
                      <small>Credit / Debit Card</small>
                    </div>
                  </label>

                </div>

                <button
                  className="confirm-pay-btn"
                  onClick={payNow}
                  disabled={paymentLoading}
                >
                  {paymentLoading
                    ? "Processing Payment..."
                    : `Pay ₹${selectedBooking.total_amount}`}
                </button>

                <p className="payment-secure-text">
                  🔒 Secure demo payment
                </p>
              </>
            ) : (
              <div className="payment-success">

                <div className="success-icon">
                  ✓
                </div>

                <p className="section-label">
                  PAYMENT COMPLETE
                </p>

                <h2>Payment Successful!</h2>

                <p>
                  Your payment of{" "}
                  <strong>
                    ₹{selectedBooking.total_amount}
                  </strong>{" "}
                  has been completed.
                </p>

                <button
                  className="confirm-pay-btn"
                  onClick={closePaymentModal}
                >
                  Done
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default MyBookings;