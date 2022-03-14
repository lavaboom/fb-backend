const express = require('express');
const router = express.Router();
const knex = require('../knexConfig');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');

/* -----------------------------------------------------------------------------
Authentication
----------------------------------------------------------------------------- */

// POST /api/users/register
// Creates a new user
// Expected body: { email, name, user_type, password }
router.post('/register', (req, res) => {
    const { email, name, user_type, password } = req.body;

    if (!name || !email || !user_type || !password) {
        return res.status(400).send('Please enter the required fields');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the new user
    const newUser = {
        ...req.body,
        rating: 5,
        password: hashedPassword
    };

    knex('users').insert(newUser).then(() => {
        knex('users').where({ email }).first().then((user) => {
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_KEY,
                { expiresIn: '168h' }
            );
            res.json({ token, user });
        })
    })
    .catch(() => {
        res.status(400).send('Failed registration');
    });
});


// POST /api/users/login
// Generates and responds a JWT for the user to use for future authorization.
// Expected body: { email, password }
// Response format: { token: 'JWT_TOKEN_HERE' }
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send('Please enter the required fields');
    }

    // Find the user
    knex('users')
        .where({ email: email })
        .first()
        .then((user) => {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(400).send('Invalid password');
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_KEY,
                { expiresIn: '168h' }
            );
            
            res.json({ token, user });
        })
        .catch((e) => {
            console.log(e)
            res.status(400).send('Invalid credentials');
        });
});

/* -----------------------------------------------------------------------------
Application logic
// GET /api/users/:userID
GET /api/users/current
GET /api/users/:id/trips
GET /api/users/:id/candidates
GET /api/users/:id/trips-with-candidates
----------------------------------------------------------------------------- */
// GET /api/users/:userID
// Gets info about a user
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:userID/details', authenticate, (req, res) => {
    knex('users')
        .where({ id: req.params.userID })
        .first()
        .select('name')
        .then((user) => {
            res.json(user);
        });
});

// GET /api/users/current
// Gets current user's trips
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/current', authenticate, (req, res) => {
    knex('users')
        .where({ email: req.user.email })
        .first()
        .select('id', 'name', 'rating', 'user_type', 'email')
        .then((user) => {
            // Respond with the user data
            // delete user.password;
            res.json(user);
        });
});

// GET /api/users/:id/trips-i-bid-on
// Gets IDs of trips the current user submitted a bid on
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:id/trips-i-bid-on', authenticate, (req, res) => {
    knex('candidates')
        .join('users', 'users.id', 'candidates.candidate_id')
        .where({ 
            candidate_id: req.params.id,
        })
        .whereIn('candidate_status', ['Pending'])
        .then((table) => {
            let filtered = table.map(item => item.trip_id);
            // get unique trip ids only
            res.json([...new Set(filtered)]);
        });
});

// GET /api/users/:id/trips
// Gets all trips (NEW or IN PROGRESS) of the currently logged in user
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:id/trips', authenticate, (req, res) => {
    knex('trips')
        .where({ 
            sender_id: req.params.id,
        })
        .whereIn('status', ['NEW', 'IN PROGRESS'])
        .orderBy('date_posted', 'desc')
        .then((trips) => {
            res.json(trips);
        });
});

// GET /api/users/:id/candidates
// Gets all the candidates for active trips for this user
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:id/candidates', authenticate, (req, res) => {
    knex('candidates')
        .join('trips', 'trips.id', 'candidates.trip_id')
        .where({ 
            sender_id: req.params.id,
            candidate_status: 'Pending'
         })
         .join('users', 'users.id', 'candidates.candidate_id')
        .where({ 
            sender_id: req.params.id,
         })
        .then((candidates) => {
            res.json(candidates);
        });
});

// GET /api/users/:id/trips-with-candidates
// Gets list of IDs of trips that have candidates - trip's sender must be current user
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/:id/trips-with-candidates', authenticate, (req, res) => {
    knex('candidates')
        .join('trips', 'trips.id', 'candidates.trip_id')
        .where({ 
            sender_id: req.params.id,
            candidate_status: 'Pending'
        })
        .then((table) => {
            let filtered = table.map(item => item.trip_id);
            // get unique trip ids only
            res.json([...new Set(filtered)]);
        });
});

module.exports = router;
