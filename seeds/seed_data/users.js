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
        name: "Turtle",
        rating: 5,
        email: "turtle@hotmail.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 3,
        name: "Leopard",
        rating: 2.6,
        email: "leopard@live.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 4,
        name: "James",
        rating: 4.5,
        email: "james@gmail.com",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 5,
        name: "Llama",
        rating: 4.2,
        email: "llama@hotmail.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 6,
        name: "Jane",
        rating: 5,
        email: "jane@hotmail.ca",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
]