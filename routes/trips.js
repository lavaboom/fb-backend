const express = require('express');
const router = express.Router();
const knex = require('../knexConfig');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');

// POST /api/trips/register
// Creates a new trip
// Expected body: { email, name, password }
router.post('/add', (req, res) => {
    const { sender_id, origin, destination, job_date, 
        payment_type, payment_amount  } = req.body;

    // Create the new trip
    const newTrip = {
        ...req.body,
        date_posted: new Date()
    };

    knex('trips')
        .insert(newTrip)
        .then(() => {
            res.status(201).send('Trip added');
        })
        .catch(() => {
            res.status(400).send('Failed to add trip');
        });
});

// GET /api/trips/:id
// Gets information about the trip
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:id', authenticate, (req, res) => {
    knex('trips')
        .where({ id: req.params.id })
        .first()
        .then((trip) => {
            res.json(trip);
        });
});

// GET /api/trips/:id
// Gets information about the trip
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.delete('/:id', authenticate, (req, res) => {
    knex('trips')
        .where({ id: req.params.id })
        .del()
        .then((tripID) => {
            res.status(201).send(`Trip ${tripID} deleted`)
        })
    .catch(() => {
        res.status(400).json({
            message: `Error deleting trip ${ req.params.id }`
        });
    });
});

module.exports = router;
