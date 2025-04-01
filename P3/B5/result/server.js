const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5001;

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'voting_db',
  password: 'postgres',
  port: 5432
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT option, COUNT(*) as count FROM votes GROUP BY option');
    const votes = result.rows.reduce((acc, row) => {
      acc[row.option] = parseInt(row.count);
      return acc;
    }, {});
    res.send(`
      <h1>Voting Results</h1>
      <p>Cats: ${votes['Cats'] || 0}</p>
      <p>Dogs: ${votes['Dogs'] || 0}</p>
    `);
  } catch (err) {
    res.status(500).send('Error retrieving results');
  }
});

app.listen(port, () => {
  console.log(`Result app running on http://localhost:${port}`);
});