require('dotenv').config();
const express = require('express');
const cors = require('cors');

const drinkRoutes = require('./routes/drinkRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/drinks', drinkRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Server Reo Jalan!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));