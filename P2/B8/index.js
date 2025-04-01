const express = require('express');
const mysql = require('mysql2/promise'); // Sử dụng mysql2 với promise
const app = express();
const port = 3000;

// Cấu hình kết nối MySQL từ biến môi trường
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

// Route để kiểm tra kết nối và lấy dữ liệu
app.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Tạo bảng mẫu nếu chưa có
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
    // Thêm dữ liệu mẫu
    await connection.execute('INSERT INTO users (name) VALUES (?) ON DUPLICATE KEY UPDATE name = name', ['Test User']);
    // Lấy dữ liệu
    const [rows] = await connection.execute('SELECT * FROM users');
    await connection.end();
    res.json({ message: 'Connected to MySQL', data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});