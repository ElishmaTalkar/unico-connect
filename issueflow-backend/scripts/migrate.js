require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

async function migrate() {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
        if (!file.endsWith('.sql')) continue;
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
        console.log(`✓ Done: ${file}`);
    }

    await pool.end();
    console.log('All migrations completed.');
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
