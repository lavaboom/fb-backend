const express = require('express');
const router = express.Router();
const knex = require('../knexConfig');
const authenticate = require('../middleware/authenticate');

/* -----------------------------------------------------------------------------
Application logic

POST   /api/trips/add

GET    /api/trips/new

GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id

GET    /api/trips/:id/candidates
POST   /api/trips/:id/candidates
PUT    /api/trips/:id/candidates
DELETE /api/trips/:id/candidates

DELETE /api/trips/:id/candidates/:candidate_id
----------------------------------------------------------------------------- */

// POST /api/trips/add
// Creates a new trip
// Expected body: { sender_id, origin, destination, 
//      job_date, payment_type, note, payment_amount }
router.post('/add', (req, res) => {
    const { job_date } = req.body;
    // Create the new trip
    const newTrip = {
        ...req.body,
        job_date: new Date(job_date),
        status: 'NEW',
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

// GET /api/trips/new
// Gets trips with status NEW
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/new', authenticate, (req, res) => {
    knex('trips')
        .where({ status: 'NEW' })
        .orderBy('date_posted', 'desc')
        .then((trips) => {
            res.status(200).json(trips);
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

// PUT /api/trips/:id
// Update trip with new info
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.put('/:id', authenticate, (req, res) => {
    knex('trips')
        .where({ id: req.params.id })
        .update(req.body)
        .then((number_of_rows_updated) => {
            res.json(number_of_rows_updated);
        });
});


// DELETE /api/trips/:id
// Delete this trip
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

// GET /api/trips/:id/candidates
// Get all candidates of this trip
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:id/candidates', authenticate, (req, res) => {
    knex('candidates')
        .join('trips', 'trips.id', 'candidates.trip_id')
        .where({ 
            trip_id: req.params.id,
            candidate_status: 'Pending'
         })
         .join('users', 'users.id', 'candidates.candidate_id')
         .select('candidates.id', 'candidates.candidate_id', 'candidates.trip_id', 'candidates.offer',
            'users.name', 'users.rating')
        .then((candidates) => {
            res.json(candidates);
        });
});

// POST /api/trips/:id/candidates
// Add a new candidate for this trip
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.post('/:id/candidates', authenticate, (req, res) => {
    // Create the new candidate
    const newCandidate = {
        candidate_status: 'Pending',
        trip_id: req.params.id,
        candidate_id: req.body.candidate_id,
        offer: req.body.offer
    };

    knex('candidates')
        .insert(newCandidate)
        .then((candidates) => {
            res.status(200).json(candidates);
        });
});

// PUT /api/trips/:id/candidates
// Change status of the candidate whose id is in the request body to accepted
// Reject everybody esle
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.put('/:id/candidates', authenticate, (req, res) => {
    knex('candidates')
        .where({ 
            trip_id: req.params.id,
         })
        .update({
            candidate_status: 'Rejected'
        })
        .then(() => {
            knex('candidates')
            .where({ 
                trip_id: req.params.id,
                candidate_id: req.body.candidate_id,
            })
            .update({
                candidate_status: 'Accepted'
            })
            .then((number_of_rows_updated) => {
                res.json(number_of_rows_updated);
            });
        });
    
});

// DELETE /api/trips/:id/candidates
// Deletes all candidates of this trip
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.delete('/:id/candidates', authenticate, (req, res) => {
    knex('candidates')
        .where({ trip_id: req.params.id })
        .del()
        .then((response) => {
            res.status(201).send(`Deleted data ${response}`)
        })
    .catch(() => {
        res.status(400).json({
            message: `Error deleting candidates from trip ${ req.params.id }`
        });
    });
});

// DELETE /api/trips/:id/candidates/:candidate_id
// Deletes just 1 particular candidate from the table
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.delete('/:id/candidates/:candidate_id', authenticate, (req, res) => {
    knex('candidates')
        .where({ 
            trip_id: req.params.id,
            candidate_id: req.params.candidate_id
         })
        .del()
        .then((response) => {
            res.status(201).send(`Deleted data ${response}`)
        })
    .catch(() => {
        res.status(400).json({
            message: `Error deleting candidates from trip ${ req.params.id }`
        });
    });
});

module.exports = router;
