const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Temporary user storage (Replace with DB in real apps)
const users = [];

// Register user
exports.register = (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Store user
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
};

// Login user and issue JWT
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
};
