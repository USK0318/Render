const express = require('express')
const app = express();
app.use(express.json());



// Simple GET API to fetch users
app.get("/users", (req, res) => {
    res.send('hello world')
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
