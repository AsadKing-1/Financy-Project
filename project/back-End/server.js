const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // Добавьте это

const app = express();
const port = 3001;

app.use(cors()); // Добавьте это
app.use(bodyParser.json());

const jsonServerUrl = 'http://localhost:3000/users';

// Register a new user
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const response = await axios.get(jsonServerUrl);
    const users = response.data;
    const userExists = users.find(user => user.username === username);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { id: Date.now(), username, email, password };
    await axios.post(jsonServerUrl, newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.get(jsonServerUrl);
    const users = response.data;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user password
app.patch('/update-password', async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const response = await axios.get(jsonServerUrl);
    const users = response.data;
    const user = users.find(user => user.username === username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await axios.put(`${jsonServerUrl}/${user.id}`, user);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});