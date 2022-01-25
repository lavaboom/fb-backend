require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.port || 8080;
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');

// middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
