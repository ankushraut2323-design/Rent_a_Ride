const express = require("express");
const router = express.Router();

const db = require("../db");

// Create a booking
router.post("/", (req, res) => {
    const {
        user_id,
        vehicle_id,
        start_date,
        end_date
    } = req.body;

    if (!user_id || !vehicle_id || !start_date || !end_date) {
        return res.status(400).json({
            message: "All booking fields are required"
        });
    }

    // Check date range
    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({
            message: "End date must be after start date"
        });
    }

    // Check vehicle availability
    const checkSql = `
        SELECT *
        FROM bookings
        WHERE vehicle_id = ?
        AND status = 'confirmed'
        AND start_date <= ?
        AND end_date >= ?
    `;

    db.query(
        checkSql,
        [vehicle_id, end_date, start_date],
        (err, bookings) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to check vehicle availability"
                });
            }

            if (bookings.length > 0) {
                return res.status(400).json({
                    message: "Vehicle is already booked for these dates"
                });
            }

            // Get vehicle price
            const vehicleSql = `
                SELECT price_per_day
                FROM vehicles
                WHERE id = ?
            `;

            db.query(vehicleSql, [vehicle_id], (err, vehicles) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Failed to get vehicle details"
                    });
                }

                if (vehicles.length === 0) {
                    return res.status(404).json({
                        message: "Vehicle not found"
                    });
                }

                const pricePerDay = Number(vehicles[0].price_per_day);

                const start = new Date(start_date);
                const end = new Date(end_date);

                const totalDays =
                    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                const totalAmount = totalDays * pricePerDay;

                const insertSql = `
                    INSERT INTO bookings
                    (user_id, vehicle_id, start_date, end_date, total_days, total_amount,payment_status)
                    VALUES (?, ?, ?, ?, ?, ?,?)
                `;

                db.query(
                    insertSql,
                    [
                        user_id,
                        vehicle_id,
                        start_date,
                        end_date,
                        totalDays,
                        totalAmount,
                        "pending"
                    ],
                    (err, result) => {

                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: "Booking failed"
                            });
                        }

                        res.status(201).json({
                            message: "Booking successful",
                            bookingId: result.insertId,
                            totalDays: totalDays,
                            totalAmount: totalAmount
                        });
                    }
                );
            });
        }
    );
});

// Get bookings for a user
router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            bookings.id,
            bookings.start_date,
            bookings.end_date,
            bookings.total_days,
            bookings.total_amount,
            bookings.status,
            bookings.payment_status,
            vehicles.name AS vehicle_name,
            vehicles.brand,
            vehicles.model
        FROM bookings
        JOIN vehicles ON bookings.vehicle_id = vehicles.id
        WHERE bookings.user_id = ?
        ORDER BY bookings.id DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch bookings"
            });
        }

        res.json(results);
    });
});

// Cancel a booking
router.delete("/:id", (req, res) => {
    const bookingId = req.params.id;

    const sql = `
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = ? AND status = 'confirmed'
    `;

    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to cancel booking"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Booking not found or already cancelled"
            });
        }

        res.json({
            message: "Booking cancelled successfully"
        });
    });
});
// Mark booking as paid
router.put("/:id/payment", (req, res) => {
    const bookingId = req.params.id;

    const sql = `
        UPDATE bookings
        SET payment_status = 'paid'
        WHERE id = ?
    `;

    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Payment failed"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.json({
            message: "Payment successful",
            bookingId: bookingId,
            paymentStatus: "paid"
        });
    });
});
module.exports = router;