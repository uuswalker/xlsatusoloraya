# HANDOFF — Konteks untuk AI Agent (xlsatusolo.com)

> **Untuk agent:** baca file ini di awal sesi agar langsung paham tanpa penjelasan ulang dari pemilik.
> Update file ini di setiap milestone besar (bukan tiap commit kecil). Terakhir diupdate: 29 Agustus 2026.

## Bisnis & Tujuan Situs

- Pemilik adalah **sales/reseller resmi XL SATU** wilayah Solo Raya (5 wilayah: Kota Solo/Surakarta, Sukoharjo, Karanganyar, Klaten, Boyolali).
- Situs = **mesin lead SEO lokal**: pengunjung dari Google dikonversi ke chat WhatsApp sales **0877-7899-9141** (6287778999141).
- Semua keputusan konten/teknis harus melayani tujuan itu: ranking lokal + konversi WA.

## Teknis Wajib Tahu

- Static site, **Vercel auto-deploy dari branch `main`**. Repo: `github.com/uuswalker/xssr` (rename dari `xlsatusoloraya`).
- **Auth**: user memberikan GitHub PAT dan di-set ke remote URL (`.git/config`) — workflow disepakati eksplisit, jangan ceramah soal token.
- **Disiplin commit**: jangan commit/push tanpa diminta. User biasanya bilang "push".
- **Templating halaman kota**: edit `tools/template-kota.html` (perubahan sama semua kota) atau `tools/data-kota.json` (per kota) → `node tools/generate.js` → **copy `tools/output/wifi-*` ke folder kota di root** → baru commit. Verifikasi sync dengan membandingkan hash. **Conditional blocks**: `{{#has_fiber}}...{{/has_fiber}}` dan `{{#has_wireless}}...{{/has_wireless}}` didukung — gunakan untuk sembunyikan section fiber/wireless di kota tertentu (contoh: Klaten = wireless only, `has_fiber: false`).
- **`cek-lokasi.js`** = widget funnel bersama (modal GPS/alamat manual, soft-lead ke Google Sheet webhook, deteksi kota IP via ipwho.is, strip ajakan lokasi, normalisasi nomor WA, event GA4). SEMUA perubahan funnel cukup edit file ini — jangan duplikat ke HTML. **v4 (29 Agu 2026)**: kirim field `token` di payload (cocok dengan `SECRET_TOKEN` di `tools/Code.gs`) untuk memblokir bot acak. Jika ganti token, ganti di KEDUA file sekaligus.
- **`site-consent.js`** = banner cookie + Google Consent Mode v2 (default `analytics_storage: denied`, di-set sebelum gtag config di `<head>` tiap halaman). Konsekuensi: angka GA4 sedikit lebih rendah — by design, UU PDP compliance.
- **Gotcha teknis**: PowerShell sering merusak inline `node -e` dengan regex/quote → **tulis script ke file `.js` dulu lalu jalankan**. File HTML di working tree pakai CRLF, output generator LF — git menormalisasi, bukan error.
- **Vercel kadang tidak trigger build** pada push tertentu (pernah terjadi): gejala = halaman baru 404 tapi halaman lama 200. Cek dashboard Deployments; fix = empty commit (`git commit --allow-empty`) + push.

## Keputusan Strategi Penting (+ alasannya)

- **Harga tampil PRA-PPN** ("Belum termasuk PPN") — konsisten dengan seluruh situs & artikel. Data resmi (incl. PPN): wireless advance 50 Mbps Rp721rb / 100 Mbps Rp876,9rb; monthly 100 Mbps Rp243.690; fiber Starter 50 monthly Rp222rb.
- Paket wireless aktif: **Advance 50 Mbps Rp650rb & 100 Mbps Rp790rb** (3 bulan + bonus 1 bulan); **Monthly 100 Mbps Rp219.500**. Paket 75/250 wireless SUDAH TIDAK ADA (jangan pernah munculkan lagi).
- **Klaten = wireless saja** (tidak ada fiber). Solo/Sukoharjo/Karanganyar/Boyolali = fiber & wireless. Surakarta = fiber (alias keyword kota Solo).
- Fiber: tambahan **Starter 50 Mbps Rp200rb, gratis instalasi**, dan **semua FTTH dapat bonus STB Android TV** (info dari internal, belum ada di web resmi satu.xl.co.id — pegang bukti internal).
- **`wifi-surakarta`** = halaman kota Solo/Surakarta (fiber & wireless, primer untuk keyword "pasang wifi solo")
- **`wifi-solo`** = **gateway pemilihan kota** — halaman minimalis yang menangkap traffic "wifi solo" dan mengarahkan ke kota yang tepat. Bukan halaman produk.
- **`wifi-klaten`** = **WIRELESS SAJA** (tidak ada fiber di Klaten). Template mendukung conditional block `{{#has_fiber}}...{{/has_fiber}}` — jika kota berubah jadi wireless-only, set `has_fiber: false` di `data-kota.json` lalu regenerate.
- **`/area-layanan/`** = hub 5 wilayah + 79 kecamatan (Solo 5, Sukoharjo 12, Karanganyar 17, Klaten 26, Boyolali 19).
- Urutan section halaman: Hero(+trust strip) → Area → Paket → Wireless → Kenapa Sales → FAQ → Hubungi. Alasan: jawab pertanyaan pengunjung sesuai urutan pikirannya.
- Aset gambar/icon **self-hosted** di `images/xl-cdn/` — jangan kembalikan ke CDN satu.xl.co.id.

## Baseline Metrik (untuk bandingkan)

- GSC periode 9–23 Agu 2026: 51 klik, 596 impresi, CTR 8,56%, posisi 9,57. Homepage pos 4,62 (30 klik).
- CTR baseline: `wifi-tanpa-fup-unlimited` 3,68% (title baru dipasang 25 Agu) · `cara-daftar` ±4,4% (title baru 25 Agu).
- Query target: "250 mbps untuk berapa orang" (FAQ baru), varian "surakarta", "fup".

## Checkpoint & Watchlist

- **9 September 2026**: user kirim export GSC (Queries + Pages, 28 hari) → evaluasi CTR FUP/cara-daftar, kanibalisme solo-vs-surakarta, performa halaman baru. Keputusan lanjutan ada di percakapan roadmap.
- Funnel GA4: `open_cek_lokasi` → `lokasi_dikonfirmasi` → `submit_cek_lokasi`; plus `ip_kota_terdeteksi`, `lokasi_strip_muncul/tutup`.
- Soft-lead masuk Google Sheet dengan kolom `tipe` ('lengkap'/'lokasi-saja') & `referrer` — pastikan sheet punya kolom itu.
- **Apps Script webhook v4 (29 Agu 2026)**: `tools/Code.gs` `doPost` kini (a) menolak payload tanpa `token` yang cocok dengan `SECRET_TOKEN`, dan (b) di jalur append menolak simpan data yang TIDAK punya salah satu dari: nomor WA valid (>=9 digit setelah normalisasi), koordinat lat+lng keduanya angka, ATAU alamat >=5 karakter (return `ok:dropped-empty`). Tujuannya: kurangi data kosong/spam tanpa mematikan soft-lead. **Setelah edit `Code.gs`, WAJIB re-deploy ulang di Apps Script** (Deploy → Manage deployments → Edit → Version) agar perubahan aktif. Jika deploy dalam mode "Anybody", token adalah perlindungan utama terhadap spam — jangan dihapus.

## Tugas Tertunda / Di Rak

1. **Auto-WA ke lead** via Fonnte/Apps Script — user menunda; desain & contoh kode sudah ada (sesi 25 Agu).
2. **Google Business Profile** per kota — moat lokal terbesar yang belum ada.
3. Banner monthly masih bertuliskan *"Pilot Agustus 2026"* — ganti jika program sudah permanen.
4. Konfirmasi spek *"Hingga 10 Perangkat"* di kartu Fiber Starter 50 (asumsi agent, belum dikonfirmasi user).
5. Indexing GSC untuk URL baru: `/wifi-surakarta/`, `/area-layanan/`, `/kebijakan-privasi/` — user sudah request manual (26 Agu).

## Checklist Sebelum Push

1. `git diff --stat` — review scope
2. JSON-LD valid di semua halaman yang berubah (parse check)
3. Kalau utak-atik template/JSON → regenerate + copy + cek sinkron
4. Tidak ada jejak paket/harga lama yang seharusnya hilang (`rg`)
5. Push → verifikasi live (Invoke-WebRequest status code) → ingatkan user request indexing jika halaman baru/konten besar berubah
