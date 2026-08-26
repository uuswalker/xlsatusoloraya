# Sistem Templating Halaman Kota — xlsatusolo.com

## Cara pakai

1. **Update data**: Edit `data-kota.json` untuk ubah teks/meta per kota (harga, deskripsi, FAQ, dll)
2. **Generate ulang**: Jalankan `node generate.js` — otomatis buat 6 halaman ke folder `output/`
3. **Review**: Cek hasil di `output/wifi-<kota>/index.html`
4. **Deploy**: Copy folder `output/wifi-*` ke root repo, lalu commit & push ke GitHub (Vercel auto-deploy)

## Struktur file

- `template-kota.html` — template HTML dengan placeholder `{{key}}`, jangan diedit kecuali mau ubah desain/struktur yang SAMA untuk semua kota
- `data-kota.json` — data unik per 6 halaman kota: Solo, Surakarta (alias keyword Kota Solo), Sukoharjo, Karanganyar, Klaten, Boyolali
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

Sudah dites: hasil generate 100% identik byte-for-byte dengan halaman yang live di GitHub. Jalankan ulang pengecekan setelah edit besar:
`node generate.js` lalu bandingkan `tools/output/wifi-*/index.html` dengan folder kota di root.

Catatan sejarah: Sragen & Wonogiri dihapus dari situs per Agustus 2026 (belum tercover jaringan FTTH/FWA). Redirect /wifi-sragen & /wifi-wonogiri dikonfigurasi di vercel.json.
