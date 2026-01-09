import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Get or create user by phone number
 */
export async function getOrCreateUser(phoneNumber, name = null) {
    try {
        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('phone_number', phoneNumber)
            .single();

        if (existingUser) {
            return { data: existingUser, error: null };
        }

        // Create new user if doesn't exist
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
                {
                    phone_number: phoneNumber,
                    name: name || phoneNumber,
                },
            ])
            .select()
            .single();

        return { data: newUser, error: createError };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Create a new transaction
 */
export async function createTransaction(userId, transactionData) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([
                {
                    user_id: userId,
                    type: transactionData.type,
                    amount: transactionData.amount,
                    category: transactionData.category,
                    description: transactionData.description,
                    date: transactionData.date || new Date().toISOString().split('T')[0],
                },
            ])
            .select()
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Get transactions for a user with optional filters
 */
export async function getTransactions(userId, filters = {}) {
    try {
        let query = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.type) {
            query = query.eq('type', filters.type);
        }

        if (filters.startDate) {
            query = query.gte('date', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('date', filters.endDate);
        }

        if (filters.category) {
            query = query.eq('category', filters.category);
        }

        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Update a transaction
 */
export async function updateTransaction(transactionId, userId, updates) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', transactionId)
            .eq('user_id', userId)
            .select()
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(transactionId, userId) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
            .eq('user_id', userId)
            .select()
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Get summary statistics for a user
 */
export async function getSummary(userId, startDate, endDate) {
    try {
        const { data, error } = await getTransactions(userId, { startDate, endDate });

        if (error) {
            return { data: null, error };
        }

        const summary = {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactionCount: data.length,
            incomeByCategory: {},
            expenseByCategory: {},
        };

        data.forEach((transaction) => {
            if (transaction.type === 'income') {
                summary.totalIncome += parseFloat(transaction.amount);
                summary.incomeByCategory[transaction.category] =
                    (summary.incomeByCategory[transaction.category] || 0) + parseFloat(transaction.amount);
            } else {
                summary.totalExpense += parseFloat(transaction.amount);
                summary.expenseByCategory[transaction.category] =
                    (summary.expenseByCategory[transaction.category] || 0) + parseFloat(transaction.amount);
            }
        });

        summary.balance = summary.totalIncome - summary.totalExpense;

        return { data: summary, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export default supabase;
