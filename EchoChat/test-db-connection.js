import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to the MySQL database.');

    // Perform a simple query to test the connection
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Query result:', rows);

    // Close the connection
    await connection.end();
  } catch (err) {
    console.error('Error connecting to the MySQL database:', err);
  }
}

testConnection();