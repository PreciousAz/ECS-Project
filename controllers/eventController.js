const express = require("express");
const verifyToken = require('../verifications/authMiddleware');
const router = express.Router();
const {createEvent,updateEvent,getEvent,getEvents,deleteEvent, updateCompletedEvents,getCompletedEvents,reverseCompletedEvent} = require('../blogics/event');

 // 📌 Create event endpoint
router.post('/api/event/create', createEvent);

 // 📌 Get all events endpoint
router.get('/api/event/all', getEvents);

 // 📌 Get all completed events endpoint
router.get('/api/event/completed', getCompletedEvents);

 // 📌 Update event endpoint
router.patch('/api/event/update/:id', updateEvent);

 // 📌 Get event endpoint
router.get('/api/event/:id', getEvent);

 // 📌 Update completed event endpoint
router.patch('/api/event/completed/:id', updateCompletedEvents);

 // 📌 Reverse completed event endpoint
router.patch('/api/event/completed/reverse/:id', reverseCompletedEvent)

 // 📌 Delete event endpoint
router.delete('/api/event/remove/:id', deleteEvent);



 // 📌 Exporting this router
module.exports = router;