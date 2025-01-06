// Fungsi untuk memuat laporan dari localStorage dan menampilkan di tabel
function loadReports() {
    // Ambil laporan yang ada dari localStorage (atau array kosong jika belum ada laporan)
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];

    // Kosongkan tabel sebelum menambah data baru
    reportTable.innerHTML = '';

    // Masukkan laporan-laporan yang ada ke dalam tabel
    reports.forEach(report => {
        const row = reportTable.insertRow();
        row.insertCell(0).textContent = report.date;
        row.insertCell(1).textContent = report.issue;
        row.insertCell(2).textContent = report.solution;
    });
}

// Panggil fungsi loadReports() saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
});

// Menangani pengiriman laporan
document.getElementById('reportForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Mengambil data dari form
    const date = document.getElementById('date').value;
    const issue = document.getElementById('issue').value;
    const solution = document.getElementById('solution').value;

    // Validasi form (Jika ada field yang kosong)
    if (!date || !issue || !solution) {
        alert("Semua field harus diisi!");
        return;
    }

    // Menambah laporan ke dalam tabel
    const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
    const row = reportTable.insertRow();
    row.insertCell(0).textContent = date;
    row.insertCell(1).textContent = issue;
    row.insertCell(2).textContent = solution;

    // Menyimpan laporan ke localStorage
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push({ date, issue, solution });
    localStorage.setItem('reports', JSON.stringify(reports));

    // Reset form setelah pengiriman
    document.getElementById('reportForm').reset();
});
