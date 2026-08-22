# XL SATU Solo Raya — Landing Page

Static landing page untuk layanan XL SATU (fiber optic & wireless internet) area Solo Raya: Kota Solo, Sukoharjo, Karanganyar, Klaten, dan Boyolali.

**Live site:** https://xlsatusolo.com

## Struktur

```
/
├── index.html                                  # Halaman utama
├── wifi-solo/index.html                        # Landing page kota Solo
├── wifi-sukoharjo/index.html                   # Landing page kota Sukoharjo
├── wifi-karanganyar/index.html                 # Landing page kota Karanganyar
├── wifi-klaten/index.html                      # Landing page kota Klaten
├── wifi-boyolali/index.html                    # Landing page kota Boyolali
├── cara-daftar-pasang-wifi-xl-satu-solo/       # Artikel: cara daftar & syarat
├── biaya-pasang-wifi-solo-raya/                # Artikel: rincian biaya
├── internet-rakyat-vs-xl-satu/                 # Artikel: perbandingan
├── panduan-fiber-vs-wireless/                  # Artikel panduan
├── panduan-wifi-kos-solo/                      # Artikel panduan
├── penyebab-wifi-lemot-cara-mengatasi/         # Artikel panduan
├── kecepatan-wifi-ideal-keluarga/              # Artikel panduan
├── wifi-tanpa-fup-unlimited/                   # Artikel panduan
├── 5-hal-wajib-dicek-sebelum-pasang-wifi-rumah/ # Artikel: checklist sebelum pasang wifi
├── solusi-internet-daerah-belum-ada-fiber-optik/ # Artikel: FWA untuk area belum ada fiber
├── images/                                      # Aset gambar self-hosted
├── tools/                                       # Sistem templating (lihat di bawah)
├── sitemap.xml
├── robots.txt
└── llms.txt                                     # Signal untuk AI crawler (eksperimental, tidak dipakai Google Search)
```

Folder-based routing (`/wifi-solo/index.html`) dipakai supaya URL bersih tanpa `.html` saat di-deploy ke Vercel.

## SEO

- Setiap halaman kota punya meta title/description unik + canonical tag.
- Schema JSON-LD: `LocalBusiness` + `FAQPage` di semua halaman kota & homepage. Artikel pakai `Article` + `FAQPage`.
- `sitemap.xml` dan `robots.txt` di root.
- Area Sragen dan Wonogiri sudah dihapus (belum tercover jaringan FTTH/FWA per Agustus 2026).

## Sistem Templating (`tools/`)

5 halaman kota di-generate dari template + data JSON, bukan diedit manual satu-satu lagi:

- `tools/template-kota.html` — template dengan placeholder `{{key}}`
- `tools/data-kota.json` — data unik per kota (meta, FAQ, kecamatan, dll)
- `tools/generate.js` — jalankan `node generate.js` untuk generate ulang 5 halaman kota ke folder `output/`
- `tools/README-templating.md` — panduan detail

Update harga/kontak yang sama di semua kota → edit `template-kota.html`. Update teks spesifik 1 kota → edit `data-kota.json`. Selalu jalankan `node generate.js` lalu copy hasil `output/wifi-*/index.html` ke folder kota masing-masing di root repo setelah edit.

## Kontak

WhatsApp Sales: 0877-7899-9141

