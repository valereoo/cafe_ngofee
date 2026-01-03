const fs = require('fs');
const csv = require('csv-parser');
const db = require('./config/database');

const results = [];

fs.createReadStream('CafeDrinks.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    try {
        await db.query("DELETE FROM drinks"); 
        for (const drink of results) {
            const query = `
                INSERT INTO drinks (name, category, price, description)
                VALUES ($1, $2, $3, $4)
            `;
            const values = [drink.Name, drink.Category, parseInt(drink.Price), drink.Description];
            await db.query(query, values);
        }
        console.log("\n✅ 100+ MENU BERHASIL MASUK DATABASE NEON!");
        process.exit(0);
    } catch (err) {
        console.error("\nGagal", err);
        process.exit(1);
    }
  });