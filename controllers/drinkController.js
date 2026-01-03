const db = require('../config/database');
const crypto = require('crypto');

const sendRes = (res, data, status = 200) => res.status(status).json({ status: "success", data });
const sendErr = (res, err, status = 500) => res.status(status).json({ error: err.message });

exports.getTopDrinks = async (req, res) => {
    try {
        const type = req.params.type;
        const order = type === 'expensive' ? 'DESC' : 'ASC';
        const { rows } = await db.query(`SELECT * FROM drinks ORDER BY price ${order} LIMIT 5`);
        sendRes(res, rows);
    } catch (err) { sendErr(res, err); }
};

exports.getDrinkById = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM drinks WHERE id = $1', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ message: "Minuman tidak ditemukan" });
        sendRes(res, rows[0]);
    } catch (err) { sendErr(res, err); }
};

exports.getAllDrinks = async (req, res) => {
    try {
        const { name, minPrice, maxPrice } = req.query;
        let query = 'SELECT * FROM drinks WHERE 1=1';
        let params = [];

        if (name) {
            params.push(`%${name}%`);
            query += ` AND name ILIKE $${params.length}`;
        }
        if (minPrice) {
            params.push(parseInt(minPrice)); 
            query += ` AND price >= $${params.length}`;
        }
        if (maxPrice) {
            params.push(parseInt(maxPrice));
            query += ` AND price <= $${params.length}`;
        }

        query += ' ORDER BY price ASC';
        const { rows } = await db.query(query, params);
        sendRes(res, rows);
    } catch (err) { sendErr(res, err); }
};

exports.checkout = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items?.length) return res.status(400).json({ message: "Keranjang kosong" });

        const orderId = `ORD-${Date.now()}`;
        let total = 0, processed = [];

        for (const item of items) {
            const { rows } = await db.query('SELECT * FROM drinks WHERE id = $1', [item.id]);
            if (rows[0]) {
                const subtotal = rows[0].price * item.quantity;
                await db.query('INSERT INTO transactions (order_id, drink_id, drink_name, price_at_purchase, quantity, subtotal) VALUES ($1, $2, $3, $4, $5, $6)', 
                [orderId, rows[0].id, rows[0].name, rows[0].price, item.quantity, subtotal]);
                total += subtotal; processed.push(rows[0].name);
            }
        }
        res.json({ status: "success", order_id: orderId, items: processed, total });
    } catch (err) { sendErr(res, err); }
};