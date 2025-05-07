const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('../db');
const app = express();
// Static folder setup
app.use(express.static(path.join(__dirname, '../public')));
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});