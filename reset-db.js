import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('⚠️  PERINGATAN: SCRIPT INI AKAN MENGHAPUS DATA! ⚠️\n');

rl.question('Apa yang ingin Anda reset?\n1. Semua Transaksi (User tetap ada)\n2. SEMUANYA (Transaksi + User)\nPilih (1/2): ', async (answer) => {

    if (answer === '1') {
        console.log('\n🗑️  Menghapus semua transaksi...');
        const { error } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (error) console.error('Error:', error.message);
        else console.log('✅ Semua transaksi berhasil dihapus!');

    } else if (answer === '2') {
        console.log('\n🗑️  Menghapus SEMUA data (users & transactions)...');

        // Transactions will be deleted automatically due to cascade delete
        const { error } = await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) console.error('Error:', error.message);
        else console.log('✅ Semua data berhasil dihapus!');

    } else {
        console.log('Batal.');
    }

    rl.close();
    process.exit(0);
});
