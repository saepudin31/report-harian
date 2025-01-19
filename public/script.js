// Fungsi untuk memformat tanggal
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Fungsi untuk memuat laporan dari backend dan menampilkannya di tabel
function loadReports() {
    fetch('https://fa1f-180-254-68-179.ngrok-free.app/laporan')  // URL backend yang benar
        .then(response => {
            if (!response.ok) {  // Cek apakah responsnya sukses (status 2xx)
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();  // Ambil respons sebagai teks terlebih dahulu
        })
        .then(responseText => {
            console.log("Response text:", responseText);  // Log respons mentah

            // Cek apakah respons dimulai dengan tanda kurung { atau [ (indikasi JSON)
            if (responseText.trim().startsWith("{") || responseText.trim().startsWith("[")) {
                try {
                    const reports = JSON.parse(responseText);  // Coba parse JSON
                    const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
                    reportTable.innerHTML = '';  // Menghapus isi tabel sebelumnya

                    // Jika laporan ditemukan, masukkan ke dalam tabel
                    if (reports.length > 0) {
                        reports.forEach(report => {
                            const row = reportTable.insertRow();
                            row.insertCell(0).textContent = formatDate(report.date); // Format tanggal
                            row.insertCell(1).textContent = report.issue;
                            row.insertCell(2).textContent = report.solution;
                        });
                    } else {
                        // Tampilkan pesan jika tidak ada laporan
                        const row = reportTable.insertRow();
                        const cell = row.insertCell(0);
                        cell.colSpan = 3;
                        cell.textContent = "Tidak ada laporan yang tersedia.";
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    alert('Terjadi kesalahan saat memproses data laporan. Respons tidak valid.');
                }
            } else {
                console.error("Received non-JSON response:", responseText);
                alert('Terjadi kesalahan pada server, respons yang diterima tidak valid.');
            }
        })
        .catch(err => {
            console.error('Error loading reports:', err);
            alert('Terjadi kesalahan saat mengambil laporan: ' + err.message);
        });
}

// Panggil fungsi loadReports() saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadReports();  // Memuat laporan saat halaman pertama kali dimuat

    // Menambahkan logika untuk memilih tanggal minimum sebagai hari ini
    const today = new Date().toISOString().split('T')[0];  // Tanggal hari ini
    document.getElementById('date').setAttribute('min', today);  // Mengatur input untuk tanggal minimum
});

// Menangani pengiriman laporan
document.getElementById('reportForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const issue = document.getElementById('issue').value;
    const solution = document.getElementById('solution').value;

    if (!date || !issue || !solution) {
        alert("Semua field harus diisi!");
        return;
    }

    // Kirim laporan ke backend
    fetch('https://fa1f-180-254-68-179.ngrok-free.app/laporan', {  // URL backend yang benar
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, issue, solution }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            loadReports(); // Refresh tabel setelah laporan berhasil dikirim
        }
    })
    .catch(error => console.error('Error:', error));

    // Reset form setelah pengiriman
    document.getElementById('reportForm').reset();
});
