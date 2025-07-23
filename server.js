// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received!');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  res.status(200).json({ success: true, message: 'Webhook received' });
});

app.get('/', (req, res) => {
  res.send('🚀 Webhook server is running on Render');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
