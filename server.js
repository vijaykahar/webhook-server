const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", // In production, use the React app's origin
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A client connected');

  // When webhook data is received
  app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    io.emit('webhookData', req.body); // Emit to React client
    res.status(200).send('Received');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
