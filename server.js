const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://digiposips:YuU0RqgRvZclkzLo@cluster0.nwcsb.mongodb.net/laporan_pekerjaan?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

const laporanSchema = new mongoose.Schema({
    date: String,
    issue: String,
    solution: String
});

const Laporan = mongoose.model('Laporan', laporanSchema);

app.post('/api/laporan', async (req, res) => {
    const { date, issue, solution } = req.body;
    const laporanBaru = new Laporan({ date, issue, solution });

    try {
        await laporanBaru.save();
        res.status(200).json({ message: 'Laporan berhasil disimpan' });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan laporan' });
    }
});

app.get('/api/laporan', async (req, res) => {
    try {
        const laporan = await Laporan.find();
        res.status(200).json(laporan);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil laporan' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
