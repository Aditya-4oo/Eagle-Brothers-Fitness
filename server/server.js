const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'eagle_brothers_super_secret_key';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 image uploads

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
       // Attempt to add avatar column if table already exists (will fail silently if it does)
       db.run(`ALTER TABLE users ADD COLUMN avatar TEXT`, () => {});
    });

    // Reviews Table
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      rating INTEGER,
      comment TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // Events Table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Event Registrations Table
    db.run(`CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      userId INTEGER,
      name TEXT,
      age INTEGER,
      phone TEXT,
      email TEXT,
      sportType TEXT,
      registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // Football Registrations Table
    db.run(`CREATE TABLE IF NOT EXISTS football_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT,
      age INTEGER,
      playingPosition TEXT,
      experienceLevel TEXT,
      phone TEXT,
      email TEXT,
      registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // Athletics Registrations Table
    db.run(`CREATE TABLE IF NOT EXISTS athletics_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT,
      age INTEGER,
      eventType TEXT,
      achievements TEXT,
      phone TEXT,
      email TEXT,
      registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // Runs Table
    db.run(`CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      distance REAL,
      duration INTEGER,
      pathData TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);
    
    // Create default admin account if not exists
    db.get("SELECT * FROM users WHERE email = ?", ['admin@eaglebrothers.com'], (err, row) => {
        if (!row) {
            const adminPassword = bcrypt.hashSync('admin123', 10);
            db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
                ['Admin User', 'admin@eaglebrothers.com', adminPassword, 'admin']);
            console.log("Default admin account created: admin@eaglebrothers.com / admin123");
        }
    });
  });
}

// Ensure Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run(`INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`,
    [name, email, phone, hashedPassword],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Error registering user' });
      }
      
      const token = jwt.sign({ id: this.lastID, role: 'user' }, SECRET_KEY, { expiresIn: '24h' });
      res.status(201).json({ message: 'User registered successfully', token, user: { id: this.lastID, name, email, role: 'user' } });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    
    // Don't send password back
    const { password: pwd, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get(`SELECT id, name, email, phone, role, avatar, registrationDate FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.post('/api/users/avatar', authenticateToken, (req, res) => {
  const { avatarBase64 } = req.body;
  db.run(`UPDATE users SET avatar = ? WHERE id = ?`, [avatarBase64, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Avatar updated successfully', avatar: avatarBase64 });
  });
});

// --- EVENT ROUTES ---
app.get('/api/events', (req, res) => {
  db.all(`SELECT * FROM events ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events', authenticateToken, requireAdmin, (req, res) => {
  const { title, date, location, description, image } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'Title and Date are required' });

  db.run(`INSERT INTO events (title, date, location, description, image) VALUES (?, ?, ?, ?, ?)`,
    [title, date, location, description, image],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, date, location, description, image });
    }
  );
});

app.put('/api/events/:id', authenticateToken, requireAdmin, (req, res) => {
  const { title, date, location, description, image } = req.body;
  db.run(`UPDATE events SET title = ?, date = ?, location = ?, description = ?, image = ? WHERE id = ?`,
    [title, date, location, description, image, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Event updated' });
    }
  );
});

app.delete('/api/events/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Event deleted' });
  });
});

// --- REGISTRATION ROUTES ---
app.post('/api/registrations/event', authenticateToken, (req, res) => {
  const { eventId, name, age, phone, email, sportType } = req.body;
  db.run(`INSERT INTO event_registrations (eventId, userId, name, age, phone, email, sportType) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [eventId, req.user.id, name, age, phone, email, sportType],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Successfully registered for event', id: this.lastID });
    }
  );
});

app.get('/api/registrations/my-events', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM event_registrations WHERE userId = ? ORDER BY registrationDate DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/admin/registrations/event', authenticateToken, requireAdmin, (req, res) => {
    db.all(`
        SELECT er.*, e.title as eventTitle, u.name as registeredByUser 
        FROM event_registrations er
        LEFT JOIN events e ON er.eventId = e.id
        LEFT JOIN users u ON er.userId = u.id
        ORDER BY er.registrationDate DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/registrations/football', authenticateToken, (req, res) => {
  const { name, age, playingPosition, experienceLevel, phone, email } = req.body;
  db.run(`INSERT INTO football_registrations (userId, name, age, playingPosition, experienceLevel, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, name, age, playingPosition, experienceLevel, phone, email],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Football registration successful', id: this.lastID });
    }
  );
});

app.get('/api/admin/registrations/football', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT * FROM football_registrations ORDER BY registrationDate DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/registrations/athletics', authenticateToken, (req, res) => {
  const { name, age, eventType, achievements, phone, email } = req.body;
  db.run(`INSERT INTO athletics_registrations (userId, name, age, eventType, achievements, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, name, age, eventType, achievements, phone, email],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Athletics registration successful', id: this.lastID });
    }
  );
});

app.get('/api/admin/registrations/athletics', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT * FROM athletics_registrations ORDER BY registrationDate DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// --- ADMIN USERS ROUTE ---
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT id, name, email, phone, role, registrationDate FROM users ORDER BY registrationDate DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- RUN TRACKER ROUTES ---
app.post('/api/runs', authenticateToken, (req, res) => {
    const { distance, duration, pathData } = req.body;
    db.run(`INSERT INTO runs (userId, distance, duration, pathData) VALUES (?, ?, ?, ?)`,
      [req.user.id, distance, duration, JSON.stringify(pathData)],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Run saved', id: this.lastID });
      }
    );
});

app.get('/api/runs', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM runs WHERE userId = ? ORDER BY date DESC`, [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

// --- REVIEWS ROUTES ---
app.get('/api/reviews', (req, res) => {
  db.all(`
    SELECT r.id, r.rating, r.comment as text, r.date, u.name, u.avatar 
    FROM reviews r
    JOIN users u ON r.userId = u.id
    ORDER BY r.date DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/reviews', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating and comment required' });
  
  db.run(`INSERT INTO reviews (userId, rating, comment) VALUES (?, ?, ?)`,
    [req.user.id, rating, comment],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Review added', id: this.lastID });
    }
  );
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: err.message, 
    code: err.code,
    stack: err.stack 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
