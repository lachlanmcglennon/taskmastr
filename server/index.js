const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("Running from:", __dirname);
const express = require('express');
const mongoose = require('../db');
const http = require('http');
const setupSocket = require('./socket');
const app = express();
const server = http.createServer(app);
setupSocket(server);

app.use(express.static(path.join(__dirname, '../public')));
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
