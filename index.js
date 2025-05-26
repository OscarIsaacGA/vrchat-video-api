const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir CORS
app.use(cors());

// Almacena videos en /videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'videos/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Servir carpeta de videos
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Página simple para subir
app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="video" accept="video/mp4" />
      <button type="submit">Subir video</button>
    </form>
  `);
});

// Endpoint de carga
app.post('/upload', upload.single('video'), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`;
  res.send(`✅ Video subido: <a href="${fileUrl}">${fileUrl}</a>`);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
