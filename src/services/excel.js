import * as XLSX from 'xlsx';

/**
 * Generate Excel file from transactions
 * @param {Array} transactions List of transactions
 * @returns {Buffer} Excel file buffer
 */
export function generateExcelReport(transactions) {
    // 1. Prepare data for Excel
    const data = transactions.map(t => ({
        Tanggal: t.date,
        Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        Kategori: t.category,
        Jumlah: parseFloat(t.amount), // Ensure number format for calculations
        Keterangan: t.description || '-'
    }));

    // 2. Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // 3. Customize column widths (Optional but nice)
    const wscols = [
        { wch: 15 }, // Tanggal
        { wch: 15 }, // Tipe
        { wch: 20 }, // Kategori
        { wch: 20 }, // Jumlah
        { wch: 30 }  // Keterangan
    ];
    ws['!cols'] = wscols;

    // 4. Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");

    // 5. Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
}
