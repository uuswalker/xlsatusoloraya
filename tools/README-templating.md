# Sistem Templating Halaman Kota — xlsatusolo.com

## Cara pakai

1. **Update data**: Edit `data-kota.json` untuk ubah teks/meta per kota (harga, deskripsi, FAQ, dll)
2. **Generate ulang**: Jalankan `node generate.js` — otomatis buat halaman ke folder `output/`
3. **Review**: Cek hasil di `output/wifi-<kota>/index.html`
4. **Deploy**: Copy folder `output/wifi-*` ke root repo, lalu commit & push ke GitHub (Vercel auto-deploy)

## Struktur file

- `template-kota.html` — template HTML dengan placeholder `{{key}}`, jangan diedit kecuali mau ubah desain/struktur yang SAMA untuk semua kota
- `data-kota.json` — data unik per kota. Field `skip_generate: true` untuk kota yang tidak ingin di-generate dari template (misal wifi-solo yang dibuat manual sebagai bridge page)
- `generate.js` — script generator (Node.js, tidak perlu install apapun — pure Node built-in)

## Kota yang di-generate

5 halaman di-generate dari template: Surakarta, Sukoharjo, Karanganyar, Klaten, Boyolali.
1 halaman dibuat manual: **wifi-solo/** (bridge page — menjelaskan Solo = Surakarta, link ke /wifi-surakarta/).

## Kalau mau ubah sesuatu yang SAMA di semua kota

Contoh: ubah harga paket, ubah nomor WhatsApp, tambah paket baru → edit `template-kota.html` langsung, lalu `node generate.js`.

## Kalau mau ubah sesuatu yang BEDA per kota

Contoh: ubah deskripsi FAQ kota tertentu, ubah meta description → edit `data-kota.json` di bagian kota terkait, lalu `node generate.js`.

## Field di data-kota.json

- `paket_count` — jumlah paket yang ditampilkan di hero stat (misal "9" untuk fiber+wireless, "3" untuk wireless only)
- `skip_generate` — `true` jika kota ini tidak ingin di-generate dari template
- `has_fiber` / `has_wireless` — menentukan section mana yang muncul (conditional blocks di template)

## Kalau mau tambah kota baru

1. Tambah 1 object baru di `data-kota.json` (copy salah satu kota, ganti semua field)
2. Tambah `{{AREA_CARD:wifi-<kota-baru>:<Nama Kota>}}` baris baru di `template-kota.html` (bagian area-grid)
3. Jalankan `node generate.js`

## Validasi

Sudah dites: hasil generate 100% identik byte-for-byte dengan halaman yang live di GitHub. Jalankan ulang pengecekan setelah edit besar:
`node generate.js` lalu bandingkan `tools/output/wifi-*/index.html` dengan folder kota di root.

Catatan sejarah: Sragen & Wonogiri dihapus dari situs per Agustus 2026 (belum tercover jaringan FTTH/FWA). Redirect /wifi-sragen & /wifi-wonogiri dikonfigurasi di vercel.json.
