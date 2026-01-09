import {
    getOrCreateUser,
    createTransaction,
    getTransactions,
    getSummary,
} from '../services/supabase.js';
import { parseTransaction, parseCommand, parseDateRange } from '../utils/parser.js';
import {
    formatTransactionConfirmation,
    formatBalanceSummary,
    formatTransactionList,
    formatHelpMessage,
    formatCategoryList,
    formatErrorMessage,
} from '../utils/formatter.js';
import { config } from '../config.js';

/**
 * Handle incoming WhatsApp messages
 */
export async function handleMessage(sock, message) {
    try {
        // Extract message info
        const from = message.key.remoteJid;
        const messageText = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!messageText) {
            return; // Ignore non-text messages
        }

        console.log(`Message from ${from}: ${messageText}`);

        // Get or create user
        const { data: user, error: userError } = await getOrCreateUser(from);

        if (userError || !user) {
            await sock.sendMessage(from, {
                text: formatErrorMessage('Gagal mengidentifikasi user. Silakan coba lagi.'),
            });
            return;
        }

        // Check if it's a command
        const command = parseCommand(messageText);

        if (command) {
            await handleCommand(sock, from, user, command);
            return;
        }

        // Try to parse as natural language transaction
        const transaction = parseTransaction(messageText);

        if (transaction) {
            await handleTransactionCreate(sock, from, user, transaction);
            return;
        }

        // If not recognized, send help
        await sock.sendMessage(from, {
            text: formatHelpMessage(),
        });
    } catch (error) {
        console.error('Error handling message:', error);
    }
}

/**
 * Handle bot commands
 */
async function handleCommand(sock, from, user, command) {
    const { command: cmd, params } = command;

    switch (cmd) {
        case 'help':
        case 'start':
            await sock.sendMessage(from, { text: formatHelpMessage() });
            break;

        case 'saldo':
        case 'balance':
            await handleBalanceCommand(sock, from, user);
            break;

        case 'laporan':
        case 'report':
            await handleReportCommand(sock, from, user, params);
            break;

        case 'transaksi':
        case 'transactions':
            await handleTransactionsCommand(sock, from, user, params);
            break;

        case 'kategori':
        case 'categories':
            await sock.sendMessage(from, {
                text: formatCategoryList(config.categories),
            });
            break;

        case 'catat':
        case 'add':
            // Parse the rest as natural language
            const transactionText = params.join(' ');
            const transaction = parseTransaction(transactionText);
            if (transaction) {
                await handleTransactionCreate(sock, from, user, transaction);
            } else {
                await sock.sendMessage(from, {
                    text: formatErrorMessage(
                        'Format tidak valid. Contoh: /catat masuk 5jt gaji atau /catat keluar 50rb makan'
                    ),
                });
            }
            break;

        default:
            await sock.sendMessage(from, {
                text: formatErrorMessage(`Perintah "${cmd}" tidak dikenali. Ketik /help untuk bantuan.`),
            });
    }
}

/**
 * Handle transaction creation
 */
async function handleTransactionCreate(sock, from, user, transactionData) {
    try {
        // Create transaction
        const { data: transaction, error } = await createTransaction(user.id, transactionData);

        if (error || !transaction) {
            await sock.sendMessage(from, {
                text: formatErrorMessage('Gagal menyimpan transaksi. Silakan coba lagi.'),
            });
            return;
        }

        // Get current month summary
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const { data: summary } = await getSummary(
            user.id,
            startOfMonth.toISOString().split('T')[0],
            today.toISOString().split('T')[0]
        );

        // Send confirmation
        await sock.sendMessage(from, {
            text: formatTransactionConfirmation(transaction, summary),
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        await sock.sendMessage(from, {
            text: formatErrorMessage('Terjadi kesalahan saat menyimpan transaksi.'),
        });
    }
}

/**
 * Handle balance command
 */
async function handleBalanceCommand(sock, from, user) {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const { data: summary, error } = await getSummary(
            user.id,
            startOfMonth.toISOString().split('T')[0],
            today.toISOString().split('T')[0]
        );

        if (error || !summary) {
            await sock.sendMessage(from, {
                text: formatErrorMessage('Gagal mengambil data saldo.'),
            });
            return;
        }

        await sock.sendMessage(from, {
            text: formatBalanceSummary(summary, 'Bulan Ini'),
        });
    } catch (error) {
        console.error('Error getting balance:', error);
        await sock.sendMessage(from, {
            text: formatErrorMessage('Terjadi kesalahan saat mengambil data saldo.'),
        });
    }
}

/**
 * Handle report command
 */
async function handleReportCommand(sock, from, user, params) {
    try {
        const periodText = params.join(' ') || 'bulan ini';
        const dateRange = parseDateRange(periodText);

        const { data: summary, error } = await getSummary(
            user.id,
            dateRange.startDate,
            dateRange.endDate
        );

        if (error || !summary) {
            await sock.sendMessage(from, {
                text: formatErrorMessage('Gagal mengambil laporan.'),
            });
            return;
        }

        let periodLabel = 'Bulan Ini';
        if (periodText.includes('hari ini')) periodLabel = 'Hari Ini';
        else if (periodText.includes('kemarin')) periodLabel = 'Kemarin';
        else if (periodText.includes('minggu ini')) periodLabel = 'Minggu Ini';

        await sock.sendMessage(from, {
            text: formatBalanceSummary(summary, periodLabel),
        });
    } catch (error) {
        console.error('Error getting report:', error);
        await sock.sendMessage(from, {
            text: formatErrorMessage('Terjadi kesalahan saat mengambil laporan.'),
        });
    }
}

/**
 * Handle transactions list command
 */
async function handleTransactionsCommand(sock, from, user, params) {
    try {
        const limit = parseInt(params[0]) || 10;

        const { data: transactions, error } = await getTransactions(user.id, { limit });

        if (error) {
            await sock.sendMessage(from, {
                text: formatErrorMessage('Gagal mengambil daftar transaksi.'),
            });
            return;
        }

        await sock.sendMessage(from, {
            text: formatTransactionList(transactions, limit),
        });
    } catch (error) {
        console.error('Error getting transactions:', error);
        await sock.sendMessage(from, {
            text: formatErrorMessage('Terjadi kesalahan saat mengambil daftar transaksi.'),
        });
    }
}
