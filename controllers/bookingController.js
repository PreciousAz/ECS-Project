const express = require("express");
const verifyToken = require('../verifications/authMiddleware');
const router = express.Router();
const { bookEvent, getEventBookings, updateBookingStatus, cancelBooking, getAllEventBookings,getEventBookingsUltra } = require("../blogics/booking");

// 📌 Book an event endpoint
router.post("/api/book", bookEvent);

 // 📌 Get all event bookings endpoint
router.get('/api/bookings/all', getAllEventBookings);

 // 📌 Get all bookings with without event id endpoint
router.get('/api/bookings', getEventBookingsUltra)

// 📌 Get all bookings for an event endpoint
router.get("/api/bookings/:eventId", getEventBookings);

// 📌 Update booking status (confirm/cancel) endpoint
router.patch("/api/booking/update/:bookingId", updateBookingStatus);

// 📌 Cancel a booking endpoint
router.delete("/api/booking/:bookingId", cancelBooking);


 // 📌 Exporting this router
module.exports = router;