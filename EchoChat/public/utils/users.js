import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name'
});

// Register user
export async function registerUser(username, password) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    return { id: result.insertId, username, password };
  } finally {
    connection.release();
  }
}

// Authenticate user
export async function authenticateUser(username, password) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

const users = [];

// Join user to chat
export function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
export function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
export function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}