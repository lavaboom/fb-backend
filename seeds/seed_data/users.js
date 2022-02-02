const bcrypt = require('bcryptjs');

module.exports = [
    {
        id: 1,
        name: "Babu",
        rating: 3.5,
        email: "babu@yahoo.com",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 2,
        name: "Niko Bellic",
        rating: 5,
        email: "Niko@hotmail.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 3,
        name: "Vincent Kompany",
        rating: 2.6,
        email: "Vincent@live.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 4,
        name: "Joe Hart",
        rating: 4.5,
        email: "Joe@gmail.com",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 5,
        name: "Mario Balotelli",
        rating: 4.2,
        email: "Mario@hotmail.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 6,
        name: "Edin Dzeko",
        rating: 5,
        email: "Edin@hotmail.ca",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
]