// Fungsi untuk memuat laporan dari backend dan menampilkannya di tabel
function loadReports() {
    fetch('http://localhost:5000/api/laporan')
        .then(response => response.json())
        .then(reports => {
            const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
            reportTable.innerHTML = '';

            reports.forEach(report => {
                const row = reportTable.insertRow();
                row.insertCell(0).textContent = report.date;
                row.insertCell(1).textContent = report.issue;
                row.insertCell(2).textContent = report.solution;
            });
        })
        .catch(err => {
            console.error('Error loading reports:', err);
        });
}

// Panggil fungsi loadReports() saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
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

    // Kirim laporan ke backend (MongoDB)
    fetch('http://localhost:5000/api/laporan', {
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
