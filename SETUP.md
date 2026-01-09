# Setup Guide - Money Flow WhatsApp Bot

## 📝 Langkah-langkah Setup

### 1️⃣ Install Node.js Dependencies

Buka terminal di folder project dan jalankan:

\`\`\`bash
cd C:\Users\Elizabeth-PC\.gemini\antigravity\scratch\money-flow-bot
npm install
\`\`\`

### 2️⃣ Setup Supabase Database

1. **Buat Akun Supabase**
   - Kunjungi [supabase.com](https://supabase.com)
   - Sign up dengan email atau GitHub
   - Gratis untuk penggunaan personal

2. **Buat Project Baru**
   - Klik "New Project"
   - Isi nama project: `money-flow-bot`
   - Buat password database (simpan baik-baik!)
   - Pilih region terdekat (Singapore untuk Indonesia)
   - Klik "Create new project"
   - Tunggu ~2 menit sampai project siap

3. **Buat Database Tables**
   - Di dashboard Supabase, klik "SQL Editor" di sidebar
   - Klik "New query"
   - Copy semua isi file `supabase-schema.sql`
   - Paste ke SQL Editor
   - Klik "Run" atau tekan Ctrl+Enter
   - Pastikan muncul pesan sukses

4. **Ambil API Credentials**
   - Klik "Settings" di sidebar
   - Klik "API"
   - Copy **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - Copy **anon/public key** (yang panjang)

### 3️⃣ Konfigurasi Environment Variables

1. **Buat file `.env`**
   - Copy file `.env.example` menjadi `.env`
   - Atau buat file baru bernama `.env` di root folder

2. **Isi credentials Supabase**

   Edit file `.env`:
   \`\`\`
   SUPABASE_URL=<https://xxxxx.supabase.co>
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   BOT_NAME=Money Flow Bot
   \`\`\`

   Ganti `xxxxx` dengan URL dan Key dari Supabase Anda.

### 4️⃣ Jalankan Bot

\`\`\`bash
npm start
\`\`\`

Anda akan melihat:

- Loading message
- QR code muncul di terminal

### 5️⃣ Login WhatsApp

1. **Siapkan nomor WhatsApp untuk bot**
   - Gunakan nomor yang tidak terpakai
   - Pastikan nomor sudah terdaftar di WhatsApp

2. **Scan QR Code**
   - Buka WhatsApp di HP
   - Tap menu (3 titik) > Perangkat Tertaut
   - Tap "Tautkan Perangkat"
   - Scan QR code yang muncul di terminal

3. **Tunggu Koneksi**
   - Setelah scan, tunggu beberapa detik
   - Akan muncul pesan "✅ Bot connected successfully!"
   - Bot siap digunakan! 🎉

### 6️⃣ Test Bot

Kirim pesan ke nomor bot dari HP lain:

\`\`\`
/help
\`\`\`

Bot akan membalas dengan panduan penggunaan.

Coba catat transaksi:

\`\`\`
masuk 5jt gaji
\`\`\`

Bot akan konfirmasi transaksi tercatat!

## ✅ Checklist Setup

- [ ] Node.js terinstall (cek: `node --version`)
- [ ] Dependencies terinstall (`npm install`)
- [ ] Akun Supabase dibuat
- [ ] Database tables dibuat (jalankan SQL schema)
- [ ] File `.env` dibuat dan diisi
- [ ] Bot dijalankan (`npm start`)
- [ ] QR code di-scan
- [ ] Bot connected successfully
- [ ] Test dengan `/help` berhasil

## 🔧 Troubleshooting

### Error: "Cannot find module"

\`\`\`bash
npm install
\`\`\`

### Error: "Invalid Supabase credentials"

- Cek file `.env`
- Pastikan SUPABASE_URL dan SUPABASE_KEY benar
- Jangan ada spasi atau quote berlebih

### QR Code tidak muncul

- Pastikan terminal mendukung output
- Coba terminal lain (PowerShell, CMD, Windows Terminal)

### Bot tidak merespon pesan

- Pastikan bot masih running (jangan tutup terminal)
- Cek koneksi internet
- Lihat log error di terminal

### "Logged out" error

- Hapus folder `auth_info_baileys`
- Jalankan ulang `npm start`
- Scan QR code lagi

## 📞 Support

Jika ada masalah, cek:

1. Log error di terminal
2. README.md untuk dokumentasi lengkap
3. Supabase dashboard untuk cek database

---

Selamat mencoba! 🚀
