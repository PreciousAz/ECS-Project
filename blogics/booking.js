const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');


// 📌 Add bookings for an event
const bookEvent = (req, res) => {
    const { event_id, user_id } = req.body;
    try {
        if (isEmpty(event_id) || isEmpty(user_id)) return res.status(400).json({ success: false, message: "Event ID and User ID are required" });

        const sql = "INSERT INTO event_bookings (event_id, user_id, booking_status) VALUES (?, ?, 'pending')";
        db.query(sql, [event_id, user_id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Error booking event" });
            return res.status(200).json({ success: true, message: "Event booked successfully", bookingId: result.insertId });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Get all bookings for an event
const getEventBookings = (req, res) => {
    const { eventId } = req.params;
    try {
        if (isEmpty(eventId)) return res.status(400).json({ success: false, message: "Event ID is required" });
        const sql = `
            SELECT eb.id, eb.user_id, eb.event_id, u.name AS name, e.event_name AS event_name, eb.booking_status, eb.booked_at 
            FROM event_bookings eb
            JOIN users u ON eb.user_id = u.id
            JOIN events e ON eb.event_id = e.id
            WHERE e.id = ?
        `;
        db.query(sql, [eventId], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Error fetching bookings" });
            return res.status(200).json({ success: true, data: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Get all bookings some extra
const getEventBookingsUltra = (req, res) => {
    try {
        const sql = `
            SELECT eb.id, eb.user_id, eb.event_id,
            u.name AS name, e.event_name AS event_name, e.event_date AS event_date, e.organizer_name AS organizer_name,
            eb.booking_status, eb.booked_at
            FROM event_bookings eb
            JOIN users u ON eb.user_id = u.id
            JOIN events e ON eb.event_id = e.id
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Error fetching bookings" });
            return res.status(200).json({ success: true, data: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Get all bookings
const getAllEventBookings = (req, res) => {
    try {
        const sql = `SELECT * FROM event_bookings`;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Error fetching bookings" });
            return res.status(200).json({ success: true, data: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Update booking status (confirm/cancel)
const updateBookingStatus = (req, res) => {
    const { bookingId } = req.params;
    try {
        if (isEmpty(bookingId)) return res.status(400).json({ success: false, message: "Booking ID is required" });
        const { status } = req.body;
        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const sql = "UPDATE event_bookings SET booking_status = ? WHERE id = ?";
        db.query(sql, [status, bookingId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Error updating booking status" });
            return res.status(200).json({ success: true, message: "Booking status updated successfully" });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Cancel a booking (DELETE)
const cancelBooking = (req, res) => {
    const { bookingId } = req.params;
    try {
        if (isEmpty(bookingId)) return res.status(400).json({ success: false, message: "Booking ID is required" });
        const sql = "DELETE FROM event_bookings WHERE id = ?";
        db.query(sql, [bookingId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Error cancelling booking" });
            return res.status(200).json({ success: true, message: "Booking cancelled successfully" });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Exporting all functions
module.exports = { bookEvent, getEventBookings, cancelBooking, updateBookingStatus, getAllEventBookings,getEventBookingsUltra }