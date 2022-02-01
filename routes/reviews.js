const express = require('express');
const router = express.Router();
const knex = require('../knexConfig');
const authenticate = require('../middleware/authenticate');

/* -----------------------------------------------------------------------------
Application logic

POST   /api/reviews/

----------------------------------------------------------------------------- */

// POST /api/reviews/
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
        .then((result) => {
            res.status(200).json(result);
        });
});