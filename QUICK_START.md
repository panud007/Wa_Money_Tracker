# Quick Start Guide - Money Flow Bot

## 🎯 Setup Supabase Database (5 Menit)

### Step 1: Buat Akun Supabase

1. **Buka browser** dan kunjungi: <https://supabase.com>
2. **Klik "Start your project"** atau "Sign Up"
3. **Sign up dengan:**
   - GitHub (recommended - paling cepat)
   - Atau email

### Step 2: Buat Project Baru

1. Setelah login, klik **"New Project"**
2. Isi form:
   - **Name:** `money-flow-bot` (atau nama lain)
   - **Database Password:** Buat password kuat (SIMPAN password ini!)
   - **Region:** Pilih `Southeast Asia (Singapore)` untuk Indonesia
   - **Pricing Plan:** Pilih **Free** (sudah cukup untuk personal use)
3. Klik **"Create new project"**
4. Tunggu ~2 menit sampai project siap (ada loading indicator)

### Step 3: Buat Database Tables

1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik **"New query"** (tombol + di atas)
3. **Copy semua isi file `supabase-schema.sql`** dari project folder
4. **Paste** ke SQL Editor
5. Klik **"Run"** atau tekan `Ctrl + Enter`
6. Pastikan muncul pesan **"Success. No rows returned"**

> 💡 **Tip:** File `supabase-schema.sql` ada di folder project Anda

### Step 4: Ambil API Credentials

1. Di sidebar kiri, klik **"Settings"** (icon gear ⚙️)
2. Klik **"API"** di submenu
3. Scroll ke bawah, Anda akan lihat:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public** key (string panjang yang dimulai dengan `eyJhbG...`)
4. **Copy kedua nilai ini** - Anda akan butuh untuk `.env`

### Step 5: Konfigurasi Bot

1. **Buka folder project:**

   ```text
   C:\Users\Elizabeth-PC\.gemini\antigravity\scratch\money-flow-bot
   ```

2. **Buat file `.env`** (copy dari `.env.example`):
   - Klik kanan `.env.example` > Copy
   - Paste di folder yang sama
   - Rename menjadi `.env` (hapus `.example`)

3. **Edit file `.env`** dengan text editor:

   ```env
   SUPABASE_URL=https://abcdefgh.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   BOT_NAME=Money Flow Bot
   ```

   Ganti dengan URL dan Key dari Supabase Anda!

## 🚀 Install & Jalankan Bot

### Step 1: Install Dependencies

Buka **PowerShell** atau **Command Prompt** di folder project:

```powershell
cd C:\Users\Elizabeth-PC\.gemini\antigravity\scratch\money-flow-bot
npm install
```

Tunggu sampai selesai (~1-2 menit).

### Step 2: Jalankan Bot

```powershell
npm start
```

Anda akan melihat:

```text
🤖 Starting Money Flow Bot...
Using WA v2.x.x, isLatest: true

📱 Scan QR code di bawah ini dengan WhatsApp:

[QR CODE MUNCUL DI SINI]

Buka WhatsApp > Perangkat Tertaut > Tautkan Perangkat
```

### Step 3: Login WhatsApp

1. **Buka WhatsApp** di HP (nomor yang tidak terpakai)
2. **Tap menu** (3 titik) di kanan atas
3. **Tap "Perangkat Tertaut"**
4. **Tap "Tautkan Perangkat"**
5. **Scan QR code** yang muncul di terminal
6. Tunggu beberapa detik...
7. Akan muncul: `✅ Bot connected successfully!`

**🎉 Bot sudah siap digunakan!**

## 🧪 Test Bot

### Test 1: Help Command

Dari HP **lain** (bukan yang dipakai bot), kirim pesan ke nomor bot:

```text
/help
```

Bot akan membalas dengan panduan lengkap.

### Test 2: Catat Transaksi (Natural Language)

Kirim pesan:

```text
masuk 5jt gaji
```

Bot akan membalas:

```text
✅ Transaksi Tercatat!

💰 Pemasukan: Rp 5.000.000
📁 Kategori: Gaji
📅 Tanggal: 8 Jan 2026

💰 Saldo Bulan Ini:
   Masuk: Rp 5.000.000
   Keluar: Rp 0
   Sisa: Rp 5.000.000
```

### Test 3: Catat Pengeluaran

```text
keluar 50rb makan siang
```

Bot akan catat dan update saldo.

### Test 4: Lihat Saldo

```text
/saldo
```

Bot akan kirim ringkasan bulan ini.

### Test 5: Lihat Laporan

```text
/laporan
```

Bot akan kirim laporan detail dengan breakdown per kategori.

### Test 6: Lihat Transaksi

```text
/transaksi
```

Bot akan kirim daftar 10 transaksi terakhir.

## ✅ Checklist Testing

- [ ] Bot berhasil connect (QR code di-scan)
- [ ] `/help` dapat response
- [ ] Catat pemasukan berhasil
- [ ] Catat pengeluaran berhasil
- [ ] `/saldo` menampilkan ringkasan
- [ ] `/laporan` menampilkan detail
- [ ] `/transaksi` menampilkan list
- [ ] Data tersimpan di Supabase (cek di dashboard)

## 🔍 Verifikasi Data di Supabase

1. Buka **Supabase Dashboard**
2. Klik **"Table Editor"** di sidebar
3. Pilih table **"users"** - Anda akan lihat user terdaftar
4. Pilih table **"transactions"** - Anda akan lihat semua transaksi

## 🐛 Troubleshooting

### Error: "Cannot find module"

```powershell
npm install
```

### Error: "Invalid Supabase credentials"

- Cek file `.env`
- Pastikan tidak ada spasi atau quote berlebih
- Copy ulang URL dan Key dari Supabase

### Bot tidak merespon

- Pastikan bot masih running (terminal jangan ditutup)
- Cek koneksi internet
- Restart bot: tutup terminal, jalankan `npm start` lagi

### QR Code tidak muncul

- Coba terminal lain (Windows Terminal, PowerShell, CMD)
- Pastikan package `qrcode-terminal` terinstall

## 📱 Tips Penggunaan

### Format Angka yang Didukung

- `50rb` atau `50ribu` = 50.000
- `5jt` atau `5juta` = 5.000.000
- `1.5jt` = 1.500.000
- `2,5jt` = 2.500.000

### Kata Kunci Kategori

**Pemasukan:**

- gaji, salary → Gaji
- bonus → Bonus
- investasi, saham → Investasi
- bisnis, usaha → Bisnis

**Pengeluaran:**

- makan, makanan, jajan → Makan
- transport, bensin, parkir, grab, gojek → Transport
- belanja, shopping, beli → Belanja
- tagihan, listrik, air, internet, pulsa → Tagihan
- nonton, game → Hiburan
- obat, dokter → Kesehatan
- kursus, buku → Pendidikan

### Contoh Chat Natural

```text
masuk 10jt gaji bulan ini
keluar 200rb bensin
bayar listrik 500rb
terima bonus 3jt
belanja 150rb di indomaret
```

## 🎯 Next Steps

Setelah bot berjalan lancar:

1. **Ajak keluarga** - Share nomor bot ke keluarga
2. **Catat rutin** - Biasakan catat setiap transaksi
3. **Review bulanan** - Gunakan `/laporan` untuk analisis
4. **Backup data** - Export dari Supabase secara berkala

---

**Need Help?**

- Cek [README.md](file:///C:/Users/Elizabeth-PC/.gemini/antigravity/scratch/money-flow-bot/README.md) untuk dokumentasi lengkap
- Cek [SETUP.md](file:///C:/Users/Elizabeth-PC/.gemini/antigravity/scratch/money-flow-bot/SETUP.md) untuk troubleshooting detail

Selamat tracking keuangan! 💰📊
