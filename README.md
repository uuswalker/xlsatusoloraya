# XL SATU Solo Raya — Landing Page

Static landing page untuk layanan XL SATU (fiber optic & wireless internet) area Solo Raya.

**Live site:** https://xlsatusolo.com

## Struktur

```
/
├── index.html                          # Halaman utama
├── wifi-solo/index.html                # Landing page kota Solo
├── wifi-sukoharjo/index.html           # Landing page kota Sukoharjo
├── wifi-klaten/index.html              # Landing page kota Klaten
├── wifi-karanganyar/index.html         # Landing page kota Karanganyar
├── wifi-boyolali/index.html            # Landing page kota Boyolali
├── wifi-sragen/index.html              # Landing page kota Sragen
├── wifi-wonogiri/index.html            # Landing page kota Wonogiri
├── panduan-fiber-vs-wireless/index.html # Artikel panduan
├── panduan-wifi-kos-solo/index.html    # Artikel panduan
├── sitemap.xml
└── robots.txt
```

Folder-based routing (`/wifi-solo/index.html`) dipakai supaya URL bersih tanpa `.html` saat di-deploy ke Vercel.

## SEO

- Setiap halaman kota punya meta title/description unik + canonical tag.
- Schema JSON-LD: `LocalBusiness` + `FAQPage` di tiap halaman kota.
- `sitemap.xml` dan `robots.txt` di root.

## Catatan maintenance

Struktur navbar/footer/FAQ diduplikasi manual di 9 file HTML (belum pakai templating/component). Kalau nambah kota baru atau ubah kontak/harga, edit manual per file dan cross-check konsistensi.

## Kontak

WhatsApp Sales: 0877-7899-9141
