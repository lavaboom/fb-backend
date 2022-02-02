const express = require('express');
const router = express.Router();
const knex = require('../knexConfig');
const authenticate = require('../middleware/authenticate');

/* -----------------------------------------------------------------------------
Application logic

POST   /api/reviews/
----------------------------------------------------------------------------- */

// GET /api/reviews/:userID
// Fetch all reviews of a user
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:userID/all-reviews', authenticate, (req, res) => {
    knex('reviews')
        .where({ for_user_id: req.params.userID })
        .then((reviews) => {
            res.status(200).json(reviews);
        });
});

// POST /api/reviews/:tripID/:driverID
// Post a review
router.post('/:tripID/:driverID', authenticate, (req, res) => {
    // Create the new candidate
    const newReview = {
        trip_id: req.params.tripID,
        for_user_id: req.params.driverID,
        by_user_id: req.body.authorID,
        score: req.body.score,
        text: req.body.text,
    };
    knex('reviews')
        .insert(newReview)
        .then(() => {
            res.status(200).send('review posted')
        });
});

module.exports = router;
