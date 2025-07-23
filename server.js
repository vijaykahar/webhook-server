// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // ✅ Use native server
const io = new Server(server, {
  cors: {
    origin: '*', // For testing only
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('📦 Webhook:', req.body);
  io.emit('webhookData', req.body);
  res.status(200).send('Received');
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected via WebSocket');
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
