const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const uri = "mongodb+srv://digiposips:YuU0RqgRvZclkzLo@cluster0.nwcsb.mongodb.net/laporan_pekerjaan?retryWrites=true&w=majority";

// Middleware untuk mengaktifkan CORS
app.use(cors()); 

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Serve file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'))); 

// Schema Mongoose untuk laporan
const laporanSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    issue: String,
    solution: String
});

// Membuat model untuk laporan
const Laporan = mongoose.model('Laporan', laporanSchema);

// Menghubungkan ke MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// POST endpoint untuk menyimpan laporan baru
app.post('/laporan', async (req, res) => {
    const { date, issue, solution } = req.body;
    const laporanBaru = new Laporan({
        date: new Date(date), // Pastikan tanggal dikonversi menjadi objek Date
        issue,
        solution
    });

    try {
        await laporanBaru.save();
        res.status(200).json({ message: 'Laporan berhasil disimpan' });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan laporan' });
    }
});

// GET endpoint untuk mengambil semua laporan
app.get('/laporan', async (req, res) => {
    try {
        const laporan = await Laporan.find().sort({ date: -1 });  // Menampilkan laporan terbaru di atas
        res.status(200).json(laporan);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil laporan' });
    }
});

// Penanganan rute yang tidak diizinkan (404)
app.all('*', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});

// Menjalankan server pada port 80
const PORT = 80;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
