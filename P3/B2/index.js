const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());

// URI kết nối MongoDB từ biến môi trường
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
let db;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUri);
    db = client.db('mydb');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Kết nối khi khởi động
connectToMongo();

// API: Thêm một item
app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await db.collection('items').insertOne({ name, createdAt: new Date() });
    res.status(201).json({ id: result.insertedId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy tất cả items
app.get('/items', async (req, res) => {
  try {
    const items = await db.collection('items').find().toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});