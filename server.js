const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received:', req.body);
  io.emit('webhook-data', req.body);
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => res.send('🚀 WebSocket server is running!'));

io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔴 Client disconnected:', socket.id));
});

server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
