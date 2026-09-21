const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");

const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.send("Rent-a-Ride Backend is Running");
});

app.get("/api/vehicles", (req, res) => {
    const sql = "SELECT * FROM vehicles";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch vehicles"
            });
        }

        res.json(results);
    });
});

// Get a single vehicle by ID
app.get("/api/vehicles/:id", (req, res) => {
    const vehicleId = req.params.id;

    const sql = `
        SELECT *
        FROM vehicles
        WHERE id = ?
    `;

    db.query(sql, [vehicleId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch vehicle"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.json(results[0]);
    });
});

// Admin: Add a vehicle
app.post("/api/vehicles", (req, res) => {
    const {
        name,
        brand,
        model,
        category,
        price_per_day,
        fuel_type,
        transmission,
        seats,
        image
    } = req.body;

    if (!name || !brand || !category || !price_per_day) {
        return res.status(400).json({
            message: "Name, brand, category and price are required"
        });
    }

    const sql = `
        INSERT INTO vehicles
        (name, brand, model, category, price_per_day,
         fuel_type, transmission, seats, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            brand,
            model,
            category,
            price_per_day,
            fuel_type,
            transmission,
            seats,
            image
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to add vehicle"
                });
            }

            res.status(201).json({
                message: "Vehicle added successfully",
                vehicleId: result.insertId
            });
        }
    );
});

// Admin: Update a vehicle
app.put("/api/vehicles/:id", (req, res) => {
    const vehicleId = req.params.id;

    const {
        name,
        brand,
        model,
        category,
        price_per_day,
        fuel_type,
        transmission,
        seats,
        image,
        status
    } = req.body;

    const sql = `
        UPDATE vehicles
        SET name = ?,
            brand = ?,
            model = ?,
            category = ?,
            price_per_day = ?,
            fuel_type = ?,
            transmission = ?,
            seats = ?,
            image = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            brand,
            model,
            category,
            price_per_day,
            fuel_type,
            transmission,
            seats,
            image,
            status,
            vehicleId
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to update vehicle"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Vehicle not found"
                });
            }

            res.json({
                message: "Vehicle updated successfully"
            });
        }
    );
});
// Admin: Delete a vehicle
app.delete("/api/vehicles/:id", (req, res) => {
    const vehicleId = req.params.id;

    const sql = `
        DELETE FROM vehicles
        WHERE id = ?
    `;

    db.query(sql, [vehicleId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to delete vehicle"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.json({
            message: "Vehicle deleted successfully"
        });
    });
});
app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});