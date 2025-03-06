const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for items
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
];

// API endpoints
app.get('/api/items', (req, res) => {
  console.log('GET /api/items - Current items:', items);
  res.json(items);
});

app.post('/api/items', (req, res) => {
  console.log('POST /api/items - Received data:', req.body);
  
  if (!req.body.name || typeof req.body.name !== 'string') {
    return res.status(400).json({ error: 'Invalid item name' });
  }

  const newItem = {
    id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
    name: req.body.name.trim()
  };

  items.push(newItem);
  console.log('Added new item:', newItem);
  console.log('Updated items list:', items);
  
  res.status(201).json(newItem);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});