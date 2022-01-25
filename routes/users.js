const express = require('express');
const router = express.Router();
const knex = require('../knexConfig');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');


// POST /api/users/register
// Creates a new user
// Expected body: { email, name, password }
router.post('/register', (req, res) => {
    const { email, name, user_type, password } = req.body;

    if (!name || !email || !user_type || !password) {
        return res.status(400).send('Please enter the required fields');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the new user
    const newUser = {
        ...req.body,
        password: hashedPassword
    };

    knex('users')
        .insert(newUser)
        .then(() => {
            res.status(201).send('Registered successfully');
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
                { expiresIn: '24h' }
            );

            res.json({ token });
        })
        .catch((e) => {
            console.log(e)
            res.status(400).send('Invalid credentials');
        });
});

// GET /api/users/trips
// Gets current user's trips
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/current', authenticate, (req, res) => {
    knex('users')
        .where({ email: req.user.email })
        .first()
        .then((user) => {
            // Respond with the user data
            delete user.password;
            res.json(user);
        });
});

// GET /api/users/trips
// Gets information about the currently logged in user
// Expects valid JWT authentication to run through the 'authenticate' middleware
router.get('/trips', authenticate, (req, res) => {
    knex('trips')
        .where({ sender_id: req.user.id })
        .then((trips) => {
            res.json(trips);
        });
});

module.exports = router;
