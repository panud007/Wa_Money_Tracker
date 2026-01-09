/**
 * Format number to Indonesian Rupiah currency
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date to Indonesian format
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

/**
 * Format transaction confirmation message
 */
export function formatTransactionConfirmation(transaction, summary) {
    const emoji = transaction.type === 'income' ? '💰' : '💸';
    const typeText = transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran';

    let message = `✅ *Transaksi Tercatat!*\n\n`;
    message += `${emoji} *${typeText}:* ${formatCurrency(transaction.amount)}\n`;
    message += `📁 *Kategori:* ${transaction.category}\n`;

    if (transaction.description) {
        message += `📝 *Keterangan:* ${transaction.description}\n`;
    }

    message += `📅 *Tanggal:* ${formatDate(transaction.date)}\n`;

    if (summary) {
        message += `\n💰 *Saldo Bulan Ini:*\n`;
        message += `   Masuk: ${formatCurrency(summary.totalIncome)}\n`;
        message += `   Keluar: ${formatCurrency(summary.totalExpense)}\n`;
        message += `   Sisa: ${formatCurrency(summary.balance)}`;
    }

    return message;
}

/**
 * Format balance summary message
 */
export function formatBalanceSummary(summary, period = 'Bulan Ini') {
    let message = `💰 *Ringkasan ${period}*\n\n`;
    message += `📈 *Pemasukan:* ${formatCurrency(summary.totalIncome)}\n`;
    message += `📉 *Pengeluaran:* ${formatCurrency(summary.totalExpense)}\n`;
    message += `💵 *Saldo:* ${formatCurrency(summary.balance)}\n`;
    message += `📊 *Total Transaksi:* ${summary.transactionCount}\n`;

    // Add category breakdown for expenses
    if (Object.keys(summary.expenseByCategory).length > 0) {
        message += `\n*Pengeluaran per Kategori:*\n`;
        const sortedExpenses = Object.entries(summary.expenseByCategory).sort((a, b) => b[1] - a[1]);

        sortedExpenses.forEach(([category, amount]) => {
            message += `  • ${category}: ${formatCurrency(amount)}\n`;
        });
    }

    return message;
}

/**
 * Format transaction list
 */
export function formatTransactionList(transactions, limit = 10) {
    if (!transactions || transactions.length === 0) {
        return '📭 Belum ada transaksi.';
    }

    let message = `📋 *Transaksi Terakhir:*\n\n`;

    const displayTransactions = transactions.slice(0, limit);

    displayTransactions.forEach((transaction, index) => {
        const emoji = transaction.type === 'income' ? '💰' : '💸';
        const sign = transaction.type === 'income' ? '+' : '-';
        // Get first 4 chars of ID for deletion reference
        const shortId = transaction.id.split('-')[0].slice(0, 4);

        message += `${index + 1}. ${emoji} ${sign}${formatCurrency(transaction.amount)} [Ref: ${shortId}]\n`;
        message += `   ${transaction.category}`;

        if (transaction.description) {
            message += ` - ${transaction.description}`;
        }

        message += `\n   ${formatDate(transaction.date)}\n\n`;
    });

    if (transactions.length > limit) {
        message += `_... dan ${transactions.length - limit} transaksi lainnya_`;
    }

    return message;
}

/**
 * Format help message
 */
export function formatHelpMessage() {
    let message = `🤖 *Money Flow Bot - Panduan*\n\n`;
    message += `*Cara Cepat (Natural Language):*\n`;
    message += `• Masuk 5jt gaji\n`;
    message += `• Keluar 50rb makan siang\n`;
    message += `• Bayar listrik 500rb\n`;
    message += `• Terima bonus 2jt\n\n`;

    message += `*Perintah Bot:*\n`;
    message += `/transaksi - Lihat daftar & Ref ID\n`;
    message += `/saldo - Lihat saldo bulan ini\n`;
    message += `/laporan - Laporan bulan ini\n`;
    message += `/hapus <ref> - Hapus transaksi (contoh: /hapus 3a1b)\n`;
    message += `/undo - Batalkan transaksi terakhir\n`;
    message += `/export - Download laporan Excel\n`;
    message += `/kategori - Lihat daftar kategori\n`;
    message += `/help - Tampilkan panduan ini\n\n`;

    message += `*Format Angka:*\n`;
    message += `• 50rb atau 50ribu = 50.000\n`;
    message += `• 5jt atau 5juta = 5.000.000\n`;
    message += `• 1.5jt = 1.500.000\n\n`;

    message += `_Kirim pesan untuk mulai mencatat!_ 📝`;

    return message;
}

/**
 * Format category list
 */
export function formatCategoryList(categories) {
    let message = `📁 *Daftar Kategori*\n\n`;

    message += `*Pemasukan:*\n`;
    categories.income.forEach((cat) => {
        message += `${cat.emoji} ${cat.name}\n`;
    });

    message += `\n*Pengeluaran:*\n`;
    categories.expense.forEach((cat) => {
        message += `${cat.emoji} ${cat.name}\n`;
    });

    return message;
}

/**
 * Format error message
 */
export function formatErrorMessage(error) {
    return `❌ *Maaf, terjadi kesalahan*\n\n${error}\n\nSilakan coba lagi atau ketik /help untuk bantuan.`;
}
