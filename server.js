const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server explicitly
const server = http.createServer(app);

// Create socket.io server with CORS config
const io = new Server(server, {
  cors: {
    origin: '*', // or specify your frontend domain
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Webhook route
app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received:', req.body);

  // Send data to all connected React clients
  io.emit('webhook-data', req.body);

  res.status(200).json({ success: true, message: 'Webhook received' });
});

// Optional: Health route
app.get('/', (req, res) => {
  res.send('Webhook server running with WebSocket');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('🟢 React client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 React client disconnected:', socket.id);
  });
});

// Start server (not app.listen!)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
