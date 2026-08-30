# Enhanced Conversions for Leads — XL SATU (AW-938834270)

Tujuan: pulihkan 20-30% konversi Ads yang hilang karena Consent Mode `denied`, tanpa cabut banner.

Lead Sheet = sumber kebenaran (100% tetap masuk via `cek-lokasi.js` + `Code.gs` v4). GA4/Ads hanya modeled ketika user Tolak cookie. Upload hash WA mingguan akan melengkapi.

## Cara kerja
1. Export Sheet `Lead` (kolom WhatsApp, Timestamp).
2. Hash nomor WA dengan SHA-256 (Google wajib hash).
3. Upload CSV ke **Google Ads > Tools > Data Manager > Enhanced Conversions for Leads**.

## Format CSV Google (header wajib)
```
hashed_phone,conversion_name,conversion_time
e164_hashed,uoD7CPXb27ADEN7y1b8D,2026-08-30 10:00:00+07:00
```
- `hashed_phone` = SHA256 dari nomor E164 tanpa spasi/dash, lowercase, trim. Contoh: `6287778999141` → `e3b0c...`.
- `conversion_name` = `uoD7CPXb27ADEN7y1b8D` (yang di `gtag('event','conversion',{'send_to':'AW-938834270/uoD7CPXb27ADEN7y1b8D'})`).
- `conversion_time` = waktu lead (kolom Timestamp Sheet) dalam timezone Asia/Jakarta.

## Script helper (Node.js) — jalankan lokal
Simpan Sheet sebagai `leads.csv` dengan kolom `whatsapp,timestamp`, lalu:

```bash
node tools/hash-leads.js leads.csv > upload.csv
```

`tools/hash-leads.js`:
```js
const fs=require('fs'),crypto=require('crypto');
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split('\n');
const out=['hashed_phone,conversion_name,conversion_time'];
for(let i=1;i<rows.length;i++){
  const [wa,ts]=rows[i].split(',');
  const clean=String(wa||'').replace(/\D/g,'').replace(/^0/,'62').trim();
  if(clean.length<9) continue;
  const e164='+'+clean;
  const hash=crypto.createHash('sha256').update(e164.trim().toLowerCase()).digest('hex');
  out.push(`${hash},uoD7CPXb27ADEN7y1b8D,${new Date(ts).toISOString().replace('T',' ').slice(0,19)}+07:00`);
}
fs.writeFileSync('upload.csv', out.join('\n'));
console.log('wrote upload.csv', out.length-1, 'rows');
```

## Jadwal
- Upload 1x/minggu (Senin). Google butuh 24-48 jam untuk mencocokkan.
- Jangan hapus banner — upload ini justru bekerja *karena* banner ada (Advanced Consent Mode).

## Verifikasi
- Google Ads > Conversions > `Youtube uuswalker conversion page` > Diagnostics harus hijau "Enhanced leads: receiving".
- Bandingkan: Sheet leads vs GA4 `click_whatsapp` vs Ads observed vs Ads modeled + enhanced.
