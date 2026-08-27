/* ============================================================
   Apps Script — Google Sheets webhook lead capture xlsatusolo.com
   Deploy sebagai Web App (Execute as: Me, whoHasAccess: Anyone).

   RIWAYAT:
   - v1: append baris mentah.
   - v2 (26 Agu 2026): soft-lead merge — full lead yang cocok
     koordinatnya dengan row 'lokasi-saja' (±5 menit, ±0.0005°)
     meng-update row tsb. Tambah kolom 10 "Tipe" (lokasi-saja/lengkap).
   - v3 (27 Agu 2026): DEDUP BY NOMOR HP — nomor HP yang sama
     tidak lagi membuat baris ganda; update baris terbaru milik
     nomor itu dengan data yang lebih lengkap.
   ============================================================ */

var SHEET_NAME = 'Lead'; // sesuaikan dengan nama sheet kamu

function doPost(e) {
  try {
    var json = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.getActiveSheet();

    // Deteksi kolom berdasarkan nama header (tahan terhadap urutan yang berubah).
    // Pastikan baris pertama sheet berisi header: Timestamp, Nama, WhatsApp, dst.
    var lastCol = sheet.getLastColumn();
    var headers = (lastCol >= 1)
      ? sheet.getRange(1, 1, 1, lastCol).getValues()[0]
      : [];

    var COLS = {
      'timestamp':      /^timestamp$/i,
      'tipe':           /^tipe$/i,
      'nama':           /^nama$/i,
      'whatsapp':       /^(whatsapp|wa|no.*wa|nomor.*wa|hape|hp)$/i,
      'latitude':       /^(latitude|lat)$/i,
      'longitude':      /^(longitude|lng|lon)$/i,
      'alamat':         /^alamat$/i,
      'kota':           /^(kota|kota.*terdeteksi|area)$/i,
      'mapsLink':       /^(maps.*link|peta|g.*maps)$/i,
      'halaman':        /^(halaman|page|url|path)$/i,
      'referrer':       /^(referrer|referral)$/i
    };

    function col(name) {
      var re = COLS[name];
      if (re) {
        for (var i = 0; i < headers.length; i++) {
          if (re.test(String(headers[i]))) return i + 1;
        }
      }
      return -1;
    }

    var cTime = col('timestamp'), cTipe = col('tipe'), cNama = col('nama'),
        cWA = col('whatsapp'), cLat = col('latitude'), cLng = col('longitude'),
        cAlamat = col('alamat'), cKota = col('kota'), cMaps = col('mapsLink'),
        cHalaman = col('halaman'), cReferrer = col('referrer');

    var tipe = json.tipe || 'lengkap';
    var wa = String(json.whatsapp || '').replace(/\D/g, '').replace(/^0/, '62');

    var now = new Date();
    var lastRow = sheet.getLastRow();

    // ---- 1) DEDUP BY NOMOR HP: cari baris terbaru dengan nomor sama ----
    var rowTarget = null;
    if (wa && wa.length >= 8) {
      var waRange = sheet.getRange(2, cWA, Math.max(1, lastRow - 1)).getValues();
      for (var r = waRange.length - 1; r >= 0; r--) { // dari bawah (terbaru) ke atas
        var existing = String(waRange[r][0] || '').replace(/\D/g, '').replace(/^0/, '62');
        if (existing && existing === wa) {
          rowTarget = r + 2; // baris aktual (mulai 2)
          break;
        }
      }
    }

    if (rowTarget) {
      // ---- Nomor HP sudah ada: update baris tsb dengan data paling lengkap ----
      var rowVals = sheet.getRange(rowTarget, 1, 1, 11).getValues()[0];

      function pilih(baru, lama) {
        var b = String(baru == null ? '' : baru).trim();
        var l = String(lama == null ? '' : lama).trim();
        if (b && b !== 'undefined' && b !== 'null') return b;
        return l;
      }

      var finalNama = pilih(json.nama, rowVals[cNama - 1]);
      var finalWA = pilih(wa, rowVals[cWA - 1]);
      var finalLat = pilih(json.latitude, rowVals[cLat - 1]);
      var finalLng = pilih(json.longitude, rowVals[cLng - 1]);
      var finalAlamat = pilih(json.alamat, rowVals[cAlamat - 1]);
      var finalKota = pilih(json.kotaTerdeteksi, rowVals[cKota - 1]);

      // baris yang sudah 'lengkap' tidak diturunkan jadi 'lokasi-saja'
      var tipeLama = String(rowVals[cTipe - 1] || '');
      var finalTipe = (tipe === 'lengkap' || tipeLama === 'lengkap') ? 'lengkap' : 'lokasi-saja';

      if (cTime > 0) sheet.getRange(rowTarget, cTime).setValue(rowVals[cTime - 1]); // pertahankan timestamp asli
      if (cTipe > 0) sheet.getRange(rowTarget, cTipe).setValue(finalTipe);
      if (cNama > 0) sheet.getRange(rowTarget, cNama).setValue(finalNama);
      if (cWA > 0) sheet.getRange(rowTarget, cWA).setValue(finalWA);
      if (cLat > 0) sheet.getRange(rowTarget, cLat).setValue(finalLat);
      if (cLng > 0) sheet.getRange(rowTarget, cLng).setValue(finalLng);
      if (cAlamat > 0) sheet.getRange(rowTarget, cAlamat).setValue(finalAlamat);
      if (cKota > 0) sheet.getRange(rowTarget, cKota).setValue(finalKota);

      // maps link sudah diisi
      if (cMaps > 0) {
        var mapsLink = (finalLat && finalLat !== 'null' && finalLng && finalLng !== 'null')
          ? 'https://www.google.com/maps?q=' + finalLat + ',' + finalLng : '';
        sheet.getRange(rowTarget, cMaps).setValue(mapsLink);
      }
      if (cHalaman > 0) sheet.getRange(rowTarget, cHalaman).setValue(pilih(json.halaman, rowVals[cHalaman - 1]));

      return ContentService.createTextOutput('ok:updated ' + rowTarget)
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // ---- 2) Soft-lead merge: full lead cocok koordinat dgn row 'lokasi-saja' ----
    if (tipe === 'lengkap') {
      var latIn = parseFloat(json.latitude);
      var lngIn = parseFloat(json.longitude);
      if (!isNaN(latIn) && !isNaN(lngIn) && lastRow > 1) {
        var latRng = sheet.getRange(2, cLat, lastRow - 1).getValues();
        var lngRng = sheet.getRange(2, cLng, lastRow - 1).getValues();
        for (var i = latRng.length - 1; i >= 0; i--) {
          var latOld = parseFloat(latRng[i][0]);
          var lngOld = parseFloat(lngRng[i][0]);
          if (isNaN(latOld) || isNaN(lngOld)) continue;
          if (Math.abs(latOld - latIn) <= 0.0005 && Math.abs(lngOld - lngIn) <= 0.0005) {
            var baris = i + 2;
            var tsOld = sheet.getRange(baris, cTime).getValue();
            var diffMs = Math.abs(now.getTime() - new Date(tsOld).getTime());
            var tipeOld = String((sheet.getRange(baris, cTipe).getValue()) || '');
            if (diffMs <= 5 * 60 * 1000 && tipeOld === 'lokasi-saja') {
              sheet.getRange(baris, cNama).setValue(json.nama);
              sheet.getRange(baris, cWA).setValue(wa);
              sheet.getRange(baris, cTipe).setValue('lengkap');
              return ContentService.createTextOutput('ok:merged ' + baris)
                .setMimeType(ContentService.MimeType.TEXT);
            }
          }
        }
      }
    }

    // ---- 3) Baris baru (append) ----
    var newRow = [
      now, tipe, json.nama || '', wa || '',
      (json.latitude != null ? json.latitude : ''),
      (json.longitude != null ? json.longitude : ''),
      json.alamat || '', json.kotaTerdeteksi || '',
      json.mapsLink || '', json.halaman || '', json.referrer || ''
    ];
    // tentukan kolom mana yang ada untuk isi sesuai header; default urutan kolom di bawah
    var MAXCOLS = 11;
    var order = [
      { h: 'Timestamp',  v: now },
      { h: 'Tipe',       v: tipe },
      { h: 'Nama',       v: json.nama || '' },
      { h: 'WhatsApp',   v: wa || '' },
      { h: 'Latitude',   v: (json.latitude != null ? json.latitude : '') },
      { h: 'Longitude',  v: (json.longitude != null ? json.longitude : '') },
      { h: 'Alamat',     v: json.alamat || '' },
      { h: 'Kota',       v: json.kotaTerdeteksi || '' },
      { h: 'Maps Link',  v: json.mapsLink || '' },
      { h: 'Halaman',    v: json.halaman || '' },
      { h: 'Referrer',   v: json.referrer || '' }
    ];

    // jika belum ada header, buat header (urutan default di atas)
    if (lastRow <= 1) {
      var headerRow = [];
      for (var hx = 0; hx < order.length; hx++) headerRow.push(order[hx].h);
      sheet.getRange(1, 1, 1, order.length).setValues([headerRow]);
    }

    // isi baris baru berdasarkan kolom yang terdeteksi
    var targetRow = sheet.getLastRow() + 1;
    var set = [];
    for (var oy = 0; oy < order.length; oy++) {
      // cocokkan header case-insensitive dengan menghapus spasi
      var cIdx = -1;
      var want = String(order[oy].h).toLowerCase().replace(/\s+/g, '');
      for (var hh = 0; hh < headers.length; hh++) {
        if (String(headers[hh]).toLowerCase().replace(/\s+/g, '') === want) { cIdx = hh + 1; break; }
      }
      if (cIdx > 0 && cIdx <= MAXCOLS) set.push([targetRow, cIdx, order[oy].v]);
    }
    if (set.length) {
      for (var s = 0; s < set.length; s++) {
        sheet.getRange(set[s][0], set[s][1]).setValue(set[s][2]);
      }
    } else {
      sheet.appendRow(arrayToRow(newRow));
    }

    return ContentService.createTextOutput('ok:appended')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function arrayToRow(a) {
  return a;
}
