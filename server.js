const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // required for socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for dev; restrict in prod
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received:', req.body);

  // Emit webhook data to all connected clients
  io.emit('webhook-data', req.body);

  res.status(200).json({ success: true, message: 'Webhook received' });
});

app.get('/', (req, res) => {
  res.send('🚀 Webhook server is running');
});

io.on('connection', (socket) => {
  console.log('🟢 A React app connected');
  socket.on('disconnect', () => {
    console.log('🔴 A React app disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
