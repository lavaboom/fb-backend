require('dotenv').config();

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.db,
    charset: 'utf8'
  }
};
