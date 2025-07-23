const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // ✅ Correct way for socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // replace with frontend URL in production
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Webhook route
app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received:', req.body);
  io.emit('webhook-data', req.body); // ✅ emit to all clients
  res.status(200).json({ status: 'ok' });
});

// Basic route
app.get('/', (req, res) => {
  res.send('🔗 WebSocket server is running!');
});

io.on('connection', (socket) => {
  console.log('🟢 A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 A client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
