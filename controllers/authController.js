const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) return res.status(400).json({ message: "Email sudah terdaftar" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hash]);
        res.json({ status: "success", message: "Registrasi berhasil, silakan login" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (rows.length === 0) return res.status(400).json({ message: "User tidak ditemukan" });
        
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(400).json({ message: "Password salah" });

        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET || 'rahasia', { expiresIn: '1d' });
        res.json({ status: "success", data: { token, username: rows[0].username } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};