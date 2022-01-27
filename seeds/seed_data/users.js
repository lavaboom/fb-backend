const bcrypt = require('bcryptjs');

module.exports = [
    {
        id: 1,
        name: "Babu",
        email: "babu@yahoo.com",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 2,
        name: "Turtle",
        email: "turtle@hotmail.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 3,
        name: "Leopard",
        email: "leopard@live.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 4,
        name: "James",
        email: "james@gmail.com",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 5,
        name: "Llama",
        email: "llama@hotmail.ca",
        user_type: "Driver",
        password: bcrypt.hashSync('123', 10)
    },
    {
        id: 6,
        name: "Jane",
        email: "jane@hotmail.ca",
        user_type: "Kitchen",
        password: bcrypt.hashSync('123', 10)
    },
]