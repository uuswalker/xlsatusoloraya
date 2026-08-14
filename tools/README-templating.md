# Sistem Templating Halaman Kota — xlsatusolo.com

## Cara pakai

1. **Update data**: Edit `data-kota.json` untuk ubah teks/meta per kota (harga, deskripsi, FAQ, dll)
2. **Generate ulang**: Jalankan `node generate.js` — otomatis buat 7 halaman ke folder `output/`
3. **Review**: Cek hasil di `output/wifi-<kota>/index.html`
4. **Deploy**: Copy folder `output/wifi-*` ke root repo, lalu commit & push ke GitHub (Vercel auto-deploy)

## Struktur file

- `template-kota.html` — template HTML dengan placeholder `{{key}}`, jangan diedit kecuali mau ubah desain/struktur yang SAMA untuk semua kota
- `data-kota.json` — data unik per 7 kota (Solo, Sukoharjo, Karanganyar, Klaten, Boyolali, Sragen, Wonogiri)
- `generate.js` — script generator (Node.js, tidak perlu install apapun — pure Node built-in)

## Kalau mau ubah sesuatu yang SAMA di semua kota

Contoh: ubah harga paket, ubah nomor WhatsApp, tambah paket baru → edit `template-kota.html` langsung, lalu `node generate.js`.

## Kalau mau ubah sesuatu yang BEDA per kota

Contoh: ubah deskripsi FAQ kota tertentu, ubah meta description → edit `data-kota.json` di bagian kota terkait, lalu `node generate.js`.

## Kalau mau tambah kota baru

1. Tambah 1 object baru di `data-kota.json` (copy salah satu kota, ganti semua field)
2. Tambah `{{AREA_CARD:wifi-<kota-baru>:<Nama Kota>}}` baris baru di `template-kota.html` (bagian area-grid)
3. Jalankan `node generate.js`

## Validasi

Sudah dites: hasil generate 100% identik byte-for-byte dengan 7 halaman yang sekarang live di GitHub (per 14 Agustus 2026). Aman dipakai.
