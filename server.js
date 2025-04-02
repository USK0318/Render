const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Change this to your frontend URL in production
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

let users = {}; // Store connected users

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on("join", (username) => {
        users[socket.id] = { id: socket.id, name: username };
        io.emit("userList", Object.values(users)); // Send updated user list
        io.emit("onlineUsers", Object.keys(users).length);
    });

    // Handle incoming messages
    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });

    // Handle typing indicator
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping");
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id];
        io.emit("userList", Object.values(users));
        io.emit("onlineUsers", Object.keys(users).length);
    });
});

// API endpoint
app.get("/", (req, res) => {
    res.send("WebSocket Chat Server is Running...");
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
