import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Supabase Connection...\n');

// Check if env variables are loaded
console.log('📋 Environment Variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Set' : '❌ Not set');
console.log('');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('❌ ERROR: Supabase credentials not found in .env file!');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
    try {
        console.log('🔌 Attempting to connect to Supabase...\n');

        // Test 1: Check if tables exist
        console.log('📊 Test 1: Checking if tables exist...');

        const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (usersError) {
            console.log('❌ Users table:', usersError.message);
        } else {
            console.log('✅ Users table: Connected');
        }

        const { data: transactionsData, error: transactionsError } = await supabase
            .from('transactions')
            .select('count')
            .limit(1);

        if (transactionsError) {
            console.log('❌ Transactions table:', transactionsError.message);
        } else {
            console.log('✅ Transactions table: Connected');
        }

        console.log('');

        // Test 2: Count existing data
        console.log('📈 Test 2: Counting existing data...');

        const { count: userCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const { count: transactionCount } = await supabase
            .from('transactions')
            .select('*', { count: 'exact', head: true });

        console.log(`👥 Total users: ${userCount || 0}`);
        console.log(`💰 Total transactions: ${transactionCount || 0}`);
        console.log('');

        // Final result
        if (!usersError && !transactionsError) {
            console.log('✅ SUCCESS: Database connection is working!');
            console.log('🎉 Bot is ready to use Supabase database!');
        } else {
            console.log('⚠️  WARNING: Some tables have errors. Check your database schema.');
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.log('\n💡 Possible issues:');
        console.log('   - Check if SUPABASE_URL and SUPABASE_KEY are correct in .env');
        console.log('   - Make sure you ran the SQL schema in Supabase SQL Editor');
        console.log('   - Check your internet connection');
    }
}

testConnection();
