// import seed data files, arrays of objects
const usersData = require('./seed_data/users');
const tripsData = require('./seed_data/trips');
const reviewsData = require('./seed_data/reviews');
const candidatesData = require('./seed_data/candidates');

exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert(usersData);
    })
    .then(() => {
      return knex('trips').del();
    })
    .then(() => {
      return knex('trips').insert(tripsData);
    })
    .then(() => {
      return knex('reviews').del();
    })
    .then(() => {
      return knex('reviews').insert(reviewsData);
    })
    .then(() => {
      return knex('candidates').del();
    })
    .then(() => {
      return knex('candidates').insert(candidatesData);
    });
};
