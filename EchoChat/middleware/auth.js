import bcrypt from 'bcryptjs';
import connection from '../db.js';

export const authenticateUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};