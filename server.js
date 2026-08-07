const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve admin UI
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));

const ALLOWED_FILES = ['gallery-data.json', 'site-data.json'];
const DATA_DIR = __dirname;

function safePathFor(file) {
  if (!ALLOWED_FILES.includes(file)) throw new Error('Not allowed');
  return path.join(DATA_DIR, file);
}

// Get JSON file
app.get('/data/:file', (req, res) => {
  try {
    const file = req.params.file;
    const p = safePathFor(file);
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
    const content = fs.readFileSync(p, 'utf8');
    res.type('application/json').send(content);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Backup and save JSON
app.post('/save/:file', (req, res) => {
  try {
    const file = req.params.file;
    const p = safePathFor(file);
    const data = req.body;
    // create backup
    const backupDir = path.join(DATA_DIR, 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
    const time = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(path.join(backupDir, `${file}.${time}.bak`), JSON.stringify(data, null, 2));
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imgDir = path.join(__dirname, 'img');
    cb(null, imgDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    // return relative path for site use
    const rel = path.posix.join('img', req.file.filename);
    res.json({ ok: true, path: rel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Serve admin.html explicitly for /admin and /admin/
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Admin server running at http://127.0.0.1:${PORT}/admin`);
});
