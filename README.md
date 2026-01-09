# Money Flow WhatsApp Bot 💰

WhatsApp bot untuk mencatat pemasukan dan pengeluaran harian/bulanan dengan database Supabase.

## 🌟 Fitur

- 💬 **Natural Language Input** - Chat santai seperti "masuk 5jt gaji" atau "keluar 50rb makan"
- 📊 **Laporan Otomatis** - Lihat saldo dan laporan harian/bulanan
- 🏷️ **Kategori Otomatis** - Bot mengenali kategori dari kata kunci
- 👥 **Multi-user** - Support banyak user dengan data terpisah
- ☁️ **Cloud Database** - Data tersimpan aman di Supabase

## 📋 Prasyarat

- Node.js v18 atau lebih baru
- Nomor WhatsApp untuk bot (terpisah dari nomor pribadi)
- Akun Supabase (gratis)

## 🚀 Setup

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Setup Supabase

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Jalankan SQL berikut di SQL Editor:

\`\`\`sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
\`\`\`

1. Copy URL dan Anon Key dari Settings > API

### 3. Konfigurasi Environment

1. Copy file `.env.example` menjadi `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit `.env` dan isi dengan credentials Supabase Anda:
   \`\`\`
   SUPABASE_URL=<https://your-project.supabase.co>
   SUPABASE_KEY=your-anon-key
   BOT_NAME=Money Flow Bot
   \`\`\`

### 4. Jalankan Bot

\`\`\`bash
npm start
\`\`\`

### 5. Login WhatsApp

1. Scan QR code yang muncul di terminal dengan WhatsApp
2. Buka WhatsApp > Perangkat Tertaut > Tautkan Perangkat
3. Tunggu sampai muncul pesan "Bot connected successfully!"

## 📱 Cara Menggunakan

### Natural Language (Cara Cepat)

Kirim pesan langsung ke bot:

- `masuk 5jt gaji` - Catat pemasukan 5 juta dari gaji
- `keluar 50rb makan siang` - Catat pengeluaran 50 ribu untuk makan
- `bayar listrik 500rb` - Catat pengeluaran 500 ribu untuk tagihan listrik
- `terima bonus 2jt` - Catat pemasukan 2 juta dari bonus

### Perintah Bot

- `/saldo` - Lihat saldo bulan ini
- `/laporan` - Laporan bulan ini
- `/laporan hari ini` - Laporan hari ini
- `/laporan minggu ini` - Laporan minggu ini
- `/transaksi` - Lihat 10 transaksi terakhir
- `/kategori` - Lihat daftar kategori
- `/help` - Tampilkan panduan

### Format Angka

- `50rb` atau `50ribu` = 50.000
- `5jt` atau `5juta` = 5.000.000
- `1.5jt` = 1.500.000
- `2,5jt` = 2.500.000

## 📁 Kategori

### Pemasukan

- 💰 Gaji
- 🎁 Bonus
- 📈 Investasi
- 💼 Bisnis
- 💵 Lainnya

### Pengeluaran

- 🍔 Makan
- 🚗 Transport
- 🛒 Belanja
- 📄 Tagihan
- 🎮 Hiburan
- 💊 Kesehatan
- 📚 Pendidikan
- 💸 Lainnya

## 🏗️ Struktur Project

\`\`\`
money-flow-bot/
├── src/
│   ├── bot.js                      # Main bot file
│   ├── config.js                   # Configuration
│   ├── handlers/
│   │   └── messageHandler.js       # Message processing
│   ├── services/
│   │   └── supabase.js            # Database operations
│   └── utils/
│       ├── parser.js              # Input parsing
│       └── formatter.js           # Response formatting
├── .env                           # Environment variables
├── package.json
└── README.md
\`\`\`

## 🔧 Development

Jalankan dengan auto-reload:

\`\`\`bash
npm run dev
\`\`\`

## ⚠️ Troubleshooting

### QR Code tidak muncul

- Pastikan terminal mendukung output QR code
- Coba restart bot dengan `npm start`

### Bot tidak merespon

- Cek koneksi internet
- Pastikan Supabase credentials benar di `.env`
- Lihat log error di terminal

### "Logged out" error

- Hapus folder `auth_info_baileys`
- Jalankan ulang bot dan scan QR code lagi

### Database error

- Pastikan tabel sudah dibuat di Supabase
- Cek apakah SUPABASE_URL dan SUPABASE_KEY benar

## 📝 Catatan

- Bot harus tetap running untuk menerima pesan
- Gunakan nomor WhatsApp terpisah untuk bot
- Data tersimpan di Supabase, aman dan bisa diakses kapan saja
- Untuk production, disarankan deploy di VPS/cloud server

## 🚀 Next Steps

Setelah bot berjalan, Anda bisa:

1. Tambah kategori custom
2. Export data ke Excel
3. Buat laporan grafik
4. Integrasi dengan Google Sheets
5. Deploy ke cloud server (Heroku, Railway, dll)

## 📄 License

MIT

---

Dibuat dengan ❤️ untuk memudahkan tracking keuangan pribadi dan keluarga
