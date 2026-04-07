const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Verilənlər bazasını faylda saxlayaq
const db = new sqlite3.Database('./medcloud.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fin_code TEXT UNIQUE,
        password TEXT,
        full_name TEXT,
        blood_group TEXT,
        role TEXT DEFAULT 'user'
    )`);
    // Admin hesabı
    db.run("INSERT OR IGNORE INTO patients (fin_code, password, full_name, blood_group, role) VALUES ('ADMIN01', 'admin123', 'Baş Həkim', 'O+', 'admin')");
});

// Səhifə yönləndirmələri
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/portal', (req, res) => res.sendFile(path.join(__dirname, 'portal.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// API-lar
app.post('/api/register', (req, res) => {
    const { fin, pass, name, blood } = req.body;
    db.run(`INSERT INTO patients (fin_code, password, full_name, blood_group) VALUES (?, ?, ?, ?)`, 
    [fin, pass, name, blood], (err) => {
        if (err) return res.status(400).json({ success: false });
        res.json({ success: true });
    });
});

app.post('/api/auth', (req, res) => {
    const { fin, pass } = req.body;
    // SQL Injection üçün zəif nöqtə (Tədris məqsədli)
    const sql = "SELECT * FROM patients WHERE fin_code = '" + fin + "' AND password = '" + pass + "'";
    db.get(sql, (err, row) => {
        if (row) res.json({ success: true, user: row });
        else res.status(401).json({ success: false });
    });
});

app.get('/api/admin/patients', (req, res) => {
    db.all("SELECT * FROM patients", [], (err, rows) => res.json(rows));
});

app.listen(3000, () => console.log("Server aktivdir: http://localhost:3000"));