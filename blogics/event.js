const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');


// 📌 Create event
const createEvent = (req, res) => {
    const { event_name, organizer_name, event_image, event_interest, event_desc, event_date, event_time, event_benefit } = req.body;
    try {
        if (isEmpty(event_name) || isEmpty(organizer_name) || isEmpty(event_image) || isEmpty(event_interest) || isEmpty(event_desc) || isEmpty(event_date) || isEmpty(event_time) || isEmpty(event_benefit)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const query = `INSERT INTO events (event_name, organizer_name, event_image, event_interest, event_desc, event_date, event_time, event_benefit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [event_name, organizer_name, event_image, event_interest, event_desc, event_date, event_time, event_benefit], (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(201).json({ success: true, message: 'Event created successfully', eventId: result.insertId });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Update event
const updateEvent = (req, res) => {
    const eventId = req.params.id;
    const { event_name, organizer_name, event_image, event_interest, event_desc, event_date, event_time, event_benefit } = req.body;
    try {
        if (isEmpty(event_name) || isEmpty(organizer_name) || isEmpty(event_image) || isEmpty(event_interest) || isEmpty(event_desc) || isEmpty(event_date) || isEmpty(event_time) || isEmpty(eventId) || isEmpty(event_benefit)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const query = `UPDATE events SET event_name = ?, organizer_name = ?, event_image = ?, event_interest = ?, event_benefit = ?, event_desc = ?, event_date = ?, event_time = ? WHERE id = ?`;
        db.query(query, [event_name, organizer_name, event_image, event_interest, event_benefit, event_desc, event_date, event_time, eventId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Event not found' });
            res.status(200).json({ success: true, message: 'Event updated successfully' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Delete an event
const deleteEvent = (req, res) => {
    const eventId = req.params.id;
    try {
        if (isEmpty(eventId)) {
            return res.status(400).json({ success: false, message: 'Event id is required' });
        }
        db.query('DELETE FROM events WHERE id = ?', [eventId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Event not found' });
            res.status(200).json({ success: true, message: 'Event deleted successfully' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR });
    }
}

// 📌 Get an event
const getEvent = (req, res) => {
    const eventId = req.params.id;
    try {
        if (isEmpty(eventId)) {
            return res.status(400).json({ success: false, message: 'Event id is required' });
        }
        db.query('SELECT * FROM events WHERE id = ?', [eventId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
            const formattedEvent = {...result[0], completed: !!result[0].completed};
            return res.status(200).json({ success: true, data: formattedEvent });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Get all events
const getEvents = (req, res) => {
    try {
        db.query('SELECT * FROM events ORDER BY event_date DESC', (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            const formattedResults = results.map(event =>({
                ...event,
                completed: !!event.completed
            }))
            return res.status(200).json({ success: true, data: formattedResults });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Mark an event completed
const updateCompletedEvents = (req, res) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ error: "Event ID is required" });

        const sql = "UPDATE events SET completed = TRUE WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });

            return res.status(200).json({ success: true, message: `Event has been marked as completed.` });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Get all completed events
const getCompletedEvents = (req, res) => {
    try {
        const sql = "SELECT * FROM events WHERE completed = TRUE";
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            const formattedResults = results.map(event =>({
                ...event,
                completed: !!event.completed
            }))
            return res.status(200).json({ success: true, data: formattedResults });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};

// 📌 Reverse completed events
const reverseCompletedEvent = (req, res) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ error: "Event ID is required" });

        const sql = "UPDATE events SET completed = FALSE WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });

            return res.status(200).json({ success: true, message: `Event ${id} restored successfully` });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
};


// 📌 Exporting all functions
module.exports = { createEvent, updateEvent, getEvent, getEvents, deleteEvent,updateCompletedEvents,getCompletedEvents,reverseCompletedEvent };