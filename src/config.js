import dotenv from 'dotenv';

dotenv.config();

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  bot: {
    name: process.env.BOT_NAME || 'Money Flow Bot',
  },
  categories: {
    income: [
      { name: 'Gaji', emoji: '💰' },
      { name: 'Bonus', emoji: '🎁' },
      { name: 'Investasi', emoji: '📈' },
      { name: 'Bisnis', emoji: '💼' },
      { name: 'Lainnya', emoji: '💵' },
    ],
    expense: [
      { name: 'Makan', emoji: '🍔' },
      { name: 'Transport', emoji: '🚗' },
      { name: 'Belanja', emoji: '🛒' },
      { name: 'Tagihan', emoji: '📄' },
      { name: 'Hiburan', emoji: '🎮' },
      { name: 'Kesehatan', emoji: '💊' },
      { name: 'Pendidikan', emoji: '📚' },
      { name: 'Lainnya', emoji: '💸' },
    ],
  },
};
