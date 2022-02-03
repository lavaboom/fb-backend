# Food Bunnies - backend

## Overview
This is the backend service for www.FoodBunnies.com - a platform that helps ghost kitchens find delivery drivers.
- Language: JavaScript
- Framework: Express JS
- Database: MySQL & Knex

## Setting up the test environment
Please have a local MySQL server up and running as well as install all dependencies (`npm install`).

### 1. The database
Rename `.env.example` to `.env` and provide it with appropriate DB connection parameters.

Run the following Knex files in this order:
- `knex migrate:up create_users.js`
- `knex migrate:up create_trips.js`
- `knex migrate:up create_candidates.js`
- `knex migrate:up create_reviews.js`

Next, generate the sample data:
- `npm run seed`

### 2. Running the test sever
Simply run `npm start` to have the server listen on port 8080 (default).