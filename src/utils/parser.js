/**
 * Parse Indonesian number format to actual number
 * Examples:
 * - "50rb" -> 50000
 * - "5jt" -> 5000000
 * - "1.5jt" -> 1500000
 * - "500ribu" -> 500000
 * - "2,5juta" -> 2500000
 */
export function parseAmount(text) {
    // Remove spaces and convert to lowercase
    const cleaned = text.toLowerCase().replace(/\s+/g, '');

    // Handle "rb", "ribu", or "k" (thousands)
    if (cleaned.includes('rb') || cleaned.includes('ribu') || cleaned.endsWith('k')) {
        const number = parseFloat(cleaned.replace(/[^\d.,]/g, '').replace(',', '.'));
        return number * 1000;
    }

    // Handle "jt" or "juta" (millions)
    if (cleaned.includes('jt') || cleaned.includes('juta')) {
        const number = parseFloat(cleaned.replace(/[^\d.,]/g, '').replace(',', '.'));
        return number * 1000000;
    }

    // Handle "m" or "milyar" (billions)
    if (cleaned.includes('m') || cleaned.includes('milyar')) {
        const number = parseFloat(cleaned.replace(/[^\d.,]/g, '').replace(',', '.'));
        return number * 1000000000;
    }

    // Handle regular number with dots/commas
    const number = parseFloat(cleaned.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
    return number;
}

/**
 * Parse natural language transaction input
 * Examples:
 * - "masuk 5jt gaji" -> { type: 'income', amount: 5000000, category: 'Gaji' }
 * - "keluar 50rb makan siang" -> { type: 'expense', amount: 50000, category: 'Makan', description: 'siang' }
 * - "bayar listrik 500rb" -> { type: 'expense', amount: 500000, category: 'Tagihan', description: 'listrik' }
 */
export function parseTransaction(message) {
    const text = message.toLowerCase().trim();

    // Determine transaction type
    let type = null;
    if (text.startsWith('masuk') || text.startsWith('terima') || text.startsWith('dapat')) {
        type = 'income';
    } else if (
        text.startsWith('keluar') ||
        text.startsWith('bayar') ||
        text.startsWith('beli') ||
        text.startsWith('belanja')
    ) {
        type = 'expense';
    }

    if (!type) {
        return null;
    }

    // Extract amount
    const amountMatch = text.match(/(\d+[.,]?\d*)\s*(rb|ribu|jt|juta|m|milyar|k)?/);
    if (!amountMatch) {
        return null;
    }

    const amountText = amountMatch[0];
    const amount = parseAmount(amountText);

    // Remove type keyword and amount from text to get category and description
    let remaining = text
        .replace(/^(masuk|keluar|terima|dapat|bayar|beli|belanja)\s*/i, '')
        .replace(amountText, '')
        .trim();

    // Category mapping keywords
    const categoryKeywords = {
        income: {
            gaji: 'Gaji',
            salary: 'Gaji',
            bonus: 'Bonus',
            investasi: 'Investasi',
            saham: 'Investasi',
            bisnis: 'Bisnis',
            usaha: 'Bisnis',
        },
        expense: {
            makan: 'Makan',
            makanan: 'Makan',
            food: 'Makan',
            jajan: 'Makan',
            transport: 'Transport',
            bensin: 'Transport',
            parkir: 'Transport',
            grab: 'Transport',
            gojek: 'Transport',
            belanja: 'Belanja',
            shopping: 'Belanja',
            beli: 'Belanja',
            tagihan: 'Tagihan',
            listrik: 'Tagihan',
            air: 'Tagihan',
            internet: 'Tagihan',
            pulsa: 'Tagihan',
            hiburan: 'Hiburan',
            nonton: 'Hiburan',
            game: 'Hiburan',
            kesehatan: 'Kesehatan',
            obat: 'Kesehatan',
            dokter: 'Kesehatan',
            pendidikan: 'Pendidikan',
            kursus: 'Pendidikan',
            buku: 'Pendidikan',
        },
    };

    // Find category
    let category = 'Lainnya';
    let description = remaining;

    const keywords = categoryKeywords[type] || {};
    for (const [keyword, cat] of Object.entries(keywords)) {
        if (remaining.includes(keyword)) {
            category = cat;
            break;
        }
    }

    return {
        type,
        amount,
        category,
        description: description || null,
    };
}

/**
 * Parse command and extract parameters
 * Example: "/catat masuk 5jt gaji" -> { command: 'catat', params: ['masuk', '5jt', 'gaji'] }
 */
export function parseCommand(message) {
    const text = message.trim();

    if (!text.startsWith('/')) {
        return null;
    }

    const parts = text.slice(1).split(/\s+/);
    const command = parts[0].toLowerCase();
    const params = parts.slice(1);

    return { command, params };
}

/**
 * Extract date range from text
 * Examples:
 * - "hari ini" -> today
 * - "kemarin" -> yesterday
 * - "minggu ini" -> this week
 * - "bulan ini" -> this month
 */
export function parseDateRange(text) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    if (text.includes('hari ini') || text.includes('today')) {
        return {
            startDate: startOfDay.toISOString().split('T')[0],
            endDate: endOfDay.toISOString().split('T')[0],
        };
    }

    if (text.includes('kemarin') || text.includes('yesterday')) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
            startDate: yesterday.toISOString().split('T')[0],
            endDate: yesterday.toISOString().split('T')[0],
        };
    }

    if (text.includes('minggu ini') || text.includes('this week')) {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
            startDate: startOfWeek.toISOString().split('T')[0],
            endDate: endOfDay.toISOString().split('T')[0],
        };
    }

    if (text.includes('bulan ini') || text.includes('this month')) {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
            startDate: startOfMonth.toISOString().split('T')[0],
            endDate: endOfDay.toISOString().split('T')[0],
        };
    }

    // Default to this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfDay.toISOString().split('T')[0],
    };
}
