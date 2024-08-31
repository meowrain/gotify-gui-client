const fs = require('node:fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let db;

const dbInit = () => {
  // Ensure the directory exists
  const dbPath = path.join(__dirname, '..', 'data', 'data.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  // Open SQLite database
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err)
    } else {
      console.log('Database opened successfully')
    }
  })

  // Create a table if not exists
  db.run('CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)', (err) => {
    if (err) {
      console.error('Error creating table', err)
    }
  })
};

const setData = (key, value) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)', [key, value], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
};

const getData = (key) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM kv_store WHERE key = ?', [key], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row ? row.value : null)
      }
    })
  })
};

module.exports = { dbInit, setData, getData };
