/* ============================================================
   Cek Ketersediaan Widget — xlsatusolo.com
   Satu sumber untuk semua halaman (homepage + halaman kota).
   Dipasang dengan: <script src="/cek-lokasi.js" defer></script>
   ============================================================ */
(function () {
  var CSS = "\r\n  .cl-modal-overlay {\r\n    position: fixed; inset: 0; background: rgba(0,0,0,0.55);\r\n    z-index: 9999; display: flex; align-items: center; justify-content: center;\r\n    padding: 16px;\r\n  }\r\n  .cl-modal-box {\r\n    background: #fff; border-radius: 16px; max-width: 480px; width: 100%;\r\n    max-height: 90vh; overflow-y: auto; padding: 28px 24px; position: relative;\r\n    box-shadow: 0 20px 60px rgba(0,0,0,0.3);\r\n  }\r\n  .cl-modal-close {\r\n    position: absolute; top: 14px; right: 16px; background: none; border: none;\r\n    font-size: 28px; line-height: 1; color: #999; cursor: pointer; padding: 4px;\r\n  }\r\n  .cl-modal-close:hover { color: #333; }\r\n  .cl-title { font-size: 19px; font-weight: 700; margin: 0 0 8px 0; color: #1a1a1a; display:flex; align-items:center; gap:8px; }\r\n  .cl-title i { color: #037e64; }\r\n  .cl-sub { font-size: 14px; color: #666; margin: 0 0 20px 0; line-height: 1.5; }\r\n  .cl-btn-primary {\r\n    width: 100%; background: linear-gradient(135deg, #0d7a5f 0%, #037e64 100%);\r\n    color: #fff; border: none; padding: 14px; border-radius: 12px; font-size: 15px;\r\n    font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;\r\n    gap: 8px; transition: opacity 0.2s;\r\n  }\r\n  .cl-btn-primary:hover { opacity: 0.9; }\r\n  .cl-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }\r\n  .cl-btn-secondary {\r\n    width: 100%; background: #f0f9f7; color: #037e64; border: 1.5px solid #037e64;\r\n    padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;\r\n    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px;\r\n  }\r\n  .cl-btn-text {\r\n    width: 100%; background: none; border: none; color: #888; font-size: 13px;\r\n    text-decoration: underline; cursor: pointer; margin-top: 10px; padding: 6px;\r\n  }\r\n  .cl-divider { text-align: center; margin: 18px 0; position: relative; color: #aaa; font-size: 13px; }\r\n  .cl-divider::before, .cl-divider::after {\r\n    content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #e5e5e5;\r\n  }\r\n  .cl-divider::before { left: 0; }\r\n  .cl-divider::after { right: 0; }\r\n  .cl-label { display: block; font-size: 13px; font-weight: 600; color: #444; margin: 14px 0 6px 0; }\r\n  .cl-input {\r\n    width: 100%; padding: 12px 14px; border: 1.5px solid #e0e0e0; border-radius: 10px;\r\n    font-size: 14px; box-sizing: border-box;\r\n  }\r\n  .cl-input:focus { outline: none; border-color: #037e64; }\r\n  .cl-autocomplete-wrap { position: relative; }\r\n  .cl-suggestions {\r\n    position: absolute; top: calc(100% + 4px); left: 0; right: 0;\r\n    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 10px;\r\n    max-height: 220px; overflow-y: auto; z-index: 10;\r\n    box-shadow: 0 8px 24px rgba(0,0,0,0.12);\r\n  }\r\n  .cl-suggestion-item {\r\n    padding: 11px 14px; font-size: 13.5px; color: #333; cursor: pointer;\r\n    border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; gap: 8px;\r\n  }\r\n  .cl-suggestion-item:last-child { border-bottom: none; }\r\n  .cl-suggestion-item:hover, .cl-suggestion-item.active { background: #f0f9f7; }\r\n  .cl-suggestion-item i { color: #037e64; margin-top: 2px; flex-shrink: 0; }\r\n  .cl-suggestion-empty { padding: 12px 14px; font-size: 13px; color: #999; text-align: center; }\r\n  #cl-map {\r\n    width: 100%; height: 220px; border-radius: 12px; margin-top: 16px; overflow: hidden;\r\n    border: 1.5px solid #e0e0e0;\r\n  }\r\n  .cl-status {\r\n    font-size: 13px; color: #666; margin-top: 12px; text-align: center; min-height: 18px;\r\n  }\r\n  .cl-status.error { color: #d33; }\r\n  .cl-status.success { color: #037e64; font-weight: 600; }\r\n";

  var HTML = "<div id=\"modal-cek-lokasi\" class=\"cl-modal-overlay\" style=\"display:none;\">\r\n  <div class=\"cl-modal-box\">\r\n    <button type=\"button\" id=\"btn-tutup-cek-lokasi\" class=\"cl-modal-close\" aria-label=\"Tutup\">&times;</button>\r\n\r\n    <div id=\"cl-step-lokasi\">\r\n      <h3 class=\"cl-title\"><i class=\"fas fa-map-marker-alt\"></i> Cek Ketersediaan di Lokasimu</h3>\r\n      <p class=\"cl-sub\">Bagikan lokasimu supaya sales kami bisa cek jangkauan XL SATU lebih cepat dan akurat.</p>\r\n\r\n      <button type=\"button\" id=\"btn-gunakan-lokasi\" class=\"cl-btn-primary\">\r\n        <i class=\"fas fa-location-crosshairs\"></i> Gunakan Lokasi Saya Sekarang\r\n      </button>\r\n\r\n      <div class=\"cl-divider\"><span>atau</span></div>\r\n\r\n      <label for=\"cl-alamat-manual\" class=\"cl-label\">Masukkan alamat manual</label>\r\n      <div class=\"cl-autocomplete-wrap\">\r\n        <input type=\"text\" id=\"cl-alamat-manual\" class=\"cl-input\" placeholder=\"Contoh: Jl. Slamet Riyadi, Solo\" autocomplete=\"off\">\r\n        <div id=\"cl-suggestions\" class=\"cl-suggestions\" style=\"display:none;\"></div>\r\n      </div>\r\n      <button type=\"button\" id=\"btn-cari-alamat\" class=\"cl-btn-secondary\">\r\n        <i class=\"fas fa-search\"></i> Cari Alamat\r\n      </button>\r\n\r\n      <div id=\"cl-map\" style=\"display:none;\"></div>\r\n      <p id=\"cl-status-lokasi\" class=\"cl-status\"></p>\r\n    </div>\r\n\r\n    <div id=\"cl-step-form\" style=\"display:none;\">\r\n      <h3 class=\"cl-title\"><i class=\"fas fa-check-circle\" style=\"color:#037e64;\"></i> Lokasi Ditemukan!</h3>\r\n      <p class=\"cl-sub\" id=\"cl-lokasi-info\"></p>\r\n\r\n      <label for=\"cl-nama\" class=\"cl-label\">Nama Lengkap</label>\r\n      <input type=\"text\" id=\"cl-nama\" class=\"cl-input\" placeholder=\"Nama kamu\" required>\r\n\r\n      <label for=\"cl-wa\" class=\"cl-label\">Nomor WhatsApp</label>\r\n      <input type=\"tel\" id=\"cl-wa\" class=\"cl-input\" placeholder=\"08xxxxxxxxxx\" required>\r\n\r\n      <button type=\"button\" id=\"btn-kirim-cek-lokasi\" class=\"cl-btn-primary\">\r\n        <i class=\"fab fa-whatsapp\"></i> Kirim & Lanjut ke WhatsApp\r\n      </button>\r\n      <button type=\"button\" id=\"btn-ganti-lokasi\" class=\"cl-btn-text\">Ganti Lokasi</button>\r\n    </div>\r\n  </div>\r\n</div>\n";

  // injeksi style + markup modal
  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);
  document.body.insertAdjacentHTML('beforeend', HTML);


(function () {
  // Lazy-load Leaflet CSS+JS on demand (baru dimuat saat modal cek lokasi dibuka)
  var leafletPromise = null;
  window.__loadLeaflet = function () {
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      css.crossOrigin = '';
      document.head.appendChild(css);

      var script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return leafletPromise;
  };
})();



(function () {
  // ====== KONFIGURASI ======
  var GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby-HJaPmYghIburVlV1ZLoAcmHY8s9nbsgVabLYqz3YiFNtV6S2rZZy7stZ5DzfWJ47/exec";
  var NOMOR_WA_SALES = "6287778999141";

  var KOTA_SOLORAYA = [
    { nama: "Solo",         lat: -7.5755, lng: 110.8243, radiusKm: 12 },
    { nama: "Sukoharjo",    lat: -7.6807, lng: 110.8380, radiusKm: 15 },
    { nama: "Klaten",       lat: -7.7058, lng: 110.6069, radiusKm: 18 },
    { nama: "Karanganyar",  lat: -7.6000, lng: 110.9500, radiusKm: 18 },
    { nama: "Boyolali",     lat: -7.5333, lng: 110.6000, radiusKm: 18 }
  ];

  var modal = document.getElementById('modal-cek-lokasi');
  var btnBuka = document.getElementById('btn-buka-cek-lokasi');
  var btnTutup = document.getElementById('btn-tutup-cek-lokasi');
  var btnGunakanLokasi = document.getElementById('btn-gunakan-lokasi');
  var btnCariAlamat = document.getElementById('btn-cari-alamat');
  var btnGantiLokasi = document.getElementById('btn-ganti-lokasi');
  var btnKirim = document.getElementById('btn-kirim-cek-lokasi');
  var inputAlamat = document.getElementById('cl-alamat-manual');
  var suggestionsEl = document.getElementById('cl-suggestions');
  var statusEl = document.getElementById('cl-status-lokasi');
  var stepLokasi = document.getElementById('cl-step-lokasi');
  var stepForm = document.getElementById('cl-step-form');
  var lokasiInfoEl = document.getElementById('cl-lokasi-info');
  var mapDiv = document.getElementById('cl-map');

  var map, marker;
  var currentLat = null, currentLng = null, currentKota = null, currentAlamatText = null;

  // Bounding box longgar area Solo Raya (untuk bias hasil pencarian)
  // format Nominatim viewbox: left,top,right,bottom (lon,lat,lon,lat)
  var SOLORAYA_VIEWBOX = '110.45,-7.30,111.15,-7.95';

  function cariAlamatNominatim(query, limit) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=0' +
      '&limit=' + (limit || 5) +
      '&countrycodes=id' +
      '&viewbox=' + SOLORAYA_VIEWBOX +
      '&bounded=1' +
      '&q=' + encodeURIComponent(query);
    return fetch(url).then(function (res) { return res.json(); }).then(function (data) {
      if (data && data.length > 0) return data;
      // Fallback: coba tanpa bounded (kalau alamat di luar area tapi tetap mau dicari)
      var urlFallback = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=0' +
        '&limit=' + (limit || 5) +
        '&countrycodes=id' +
        '&q=' + encodeURIComponent(query + ', Jawa Tengah');
      return fetch(urlFallback).then(function (res) { return res.json(); });
    });
  }

  var autocompleteTimer = null;
  var suggestionAbortController = null;

  function tampilkanSuggestions(list) {
    suggestionsEl.innerHTML = '';
    if (!list || list.length === 0) {
      suggestionsEl.innerHTML = '<div class="cl-suggestion-empty">Tidak ada saran. Coba kata kunci lain atau tekan "Cari Alamat".</div>';
      suggestionsEl.style.display = 'block';
      return;
    }
    list.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'cl-suggestion-item';
      div.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>' + item.display_name + '</span>';
      div.addEventListener('click', function () {
        inputAlamat.value = item.display_name;
        suggestionsEl.style.display = 'none';
        prosesLokasi(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
      });
      suggestionsEl.appendChild(div);
    });
    suggestionsEl.style.display = 'block';
  }

  inputAlamat.addEventListener('input', function () {
    var q = inputAlamat.value.trim();
    clearTimeout(autocompleteTimer);
    if (q.length < 3) {
      suggestionsEl.style.display = 'none';
      return;
    }
    autocompleteTimer = setTimeout(function () {
      cariAlamatNominatim(q, 5).then(function (data) {
        tampilkanSuggestions(data);
      }).catch(function () {
        suggestionsEl.style.display = 'none';
      });
    }, 450);
  });

  document.addEventListener('click', function (e) {
    if (!suggestionsEl.contains(e.target) && e.target !== inputAlamat) {
      suggestionsEl.style.display = 'none';
    }
  });

  function toRad(deg) { return deg * Math.PI / 180; }
  function jarakKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function deteksiKota(lat, lng) {
    var terdekat = null, jarakTerdekat = Infinity;
    for (var i = 0; i < KOTA_SOLORAYA.length; i++) {
      var k = KOTA_SOLORAYA[i];
      var d = jarakKm(lat, lng, k.lat, k.lng);
      if (d < jarakTerdekat) { jarakTerdekat = d; terdekat = k; }
    }
    if (terdekat && jarakTerdekat <= terdekat.radiusKm) {
      return { nama: terdekat.nama, dalamArea: true };
    }
    return { nama: terdekat ? terdekat.nama : null, dalamArea: false };
  }

  function tampilkanPeta(lat, lng) {
    mapDiv.style.display = 'block';
    window.__loadLeaflet().then(function () {
      if (!map) {
        map = L.map('cl-map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);
        marker = L.marker([lat, lng]).addTo(map);
      } else {
        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]);
      }
      setTimeout(function () { map.invalidateSize(); }, 100);
    });
  }

  // ---- Soft-lead: lokasi dicatat ke Sheet SEBELUM form nama/WA. ----
  var softLeadTerkirim = false;
  function kirimSoftLead() {
    if (softLeadTerkirim) return;
    softLeadTerkirim = true;

    var mapsLink = (currentLat != null && currentLng != null)
      ? 'https://www.google.com/maps?q=' + currentLat + ',' + currentLng
      : '';
    var data = {
      timestamp: new Date().toISOString(),
      tipe: 'lokasi-saja',
      nama: '',
      whatsapp: '',
      latitude: currentLat,
      longitude: currentLng,
      alamat: currentAlamatText || '',
      kotaTerdeteksi: currentKota || '',
      mapsLink: mapsLink,
      halaman: window.location.pathname,
      referrer: document.referrer || ''
    };
    if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.indexOf('GANTI_DENGAN') === -1) {
      fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      }).catch(function () {});
    }
  }

  function fokusForm() {
    setTimeout(function () {
      var el = document.getElementById('cl-nama');
      if (el) el.focus();
    }, 950);
  }

  function prosesLokasiTanpaKoordinat(alamatText) {
    currentLat = null;
    currentLng = null;
    currentAlamatText = alamatText;
    currentKota = null;
    mapDiv.style.display = 'none';
    kirimSoftLead();
    fokusForm();
    if (typeof gtag === 'function') {
      gtag('event', 'lokasi_dikonfirmasi', { kota_terdeteksi: 'unknown', page_path: window.location.pathname });
    }

    statusEl.className = 'cl-status';
    statusEl.textContent = 'Alamat dicatat tanpa titik peta pasti. Sales kami akan konfirmasi lokasi lebih lanjut.';

    setTimeout(function () {
      lokasiInfoEl.textContent = 'Alamat: ' + alamatText + ' (lokasi belum terverifikasi peta)';
      stepLokasi.style.display = 'none';
      stepForm.style.display = 'block';
    }, 600);
  }

  function prosesLokasi(lat, lng, alamatText) {
    currentLat = lat;
    currentLng = lng;
    currentAlamatText = alamatText || null;
    tampilkanPeta(lat, lng);
    kirimSoftLead();
    fokusForm();

    var hasil = deteksiKota(lat, lng);
    currentKota = hasil.nama;
    if (typeof gtag === 'function') {
      gtag('event', 'lokasi_dikonfirmasi', { kota_terdeteksi: currentKota || 'unknown', page_path: window.location.pathname });
    }

    if (hasil.dalamArea) {
      statusEl.className = 'cl-status success';
      statusEl.textContent = '✓ Lokasi terdeteksi di area ' + hasil.nama;
    } else {
      statusEl.className = 'cl-status';
      statusEl.textContent = 'Lokasi terdeteksi dekat ' + (hasil.nama || 'Solo Raya') + '. Tetap bisa dicek manual oleh sales kami.';
    }

    setTimeout(function () {
      lokasiInfoEl.textContent = 'Lokasi: ' + (alamatText ? alamatText : lat.toFixed(5) + ', ' + lng.toFixed(5)) +
        (hasil.nama ? ' (dekat ' + hasil.nama + ')' : '');
      stepLokasi.style.display = 'none';
      stepForm.style.display = 'block';
    }, 900);
  }

  if (btnBuka) btnBuka.addEventListener('click', function () {
    modal.style.display = 'flex';
    window.__loadLeaflet();
    if (typeof gtag === 'function') {
      gtag('event', 'open_cek_lokasi', { page_path: window.location.pathname });
    }
    setTimeout(function () { if (map) map.invalidateSize(); }, 200);
  });

  document.querySelectorAll('.btn-cek-lokasi-trigger').forEach(function (el) {
    el.addEventListener('click', function () {
      modal.style.display = 'flex';
      window.__loadLeaflet();
      if (typeof gtag === 'function') {
        gtag('event', 'open_cek_lokasi', { page_path: window.location.pathname, trigger: 'header' });
      }
      setTimeout(function () { if (map) map.invalidateSize(); }, 200);
    });
  });

  btnTutup.addEventListener('click', function () { modal.style.display = 'none'; });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.style.display = 'none'; });

  var MAX_TUNGGU_DETIK = 8;
  var TARGET_AKURASI_METER = 500;

  btnGunakanLokasi.addEventListener('click', function () {
    if (!navigator.geolocation) {
      statusEl.className = 'cl-status error';
      statusEl.textContent = 'Browser kamu tidak mendukung deteksi lokasi. Gunakan input alamat manual.';
      return;
    }
    btnGunakanLokasi.disabled = true;

    var watchId = null;
    var bestPos = null;
    var detikTersisa = MAX_TUNGGU_DETIK;

    function bersihkanWatch() {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      clearInterval(countdownTimer);
      clearTimeout(timeoutTimer);
    }

    function updateStatusCountdown() {
      var akurasiText = bestPos ? '±' + Math.round(bestPos.coords.accuracy) + 'm' : 'mencari sinyal...';
      statusEl.className = 'cl-status';
      statusEl.textContent = 'Menyempurnakan lokasi presisi... (' + detikTersisa + ' detik) — Akurasi saat ini: ' + akurasiText;
    }

    updateStatusCountdown();
    var countdownTimer = setInterval(function () {
      detikTersisa -= 1;
      if (detikTersisa > 0) {
        updateStatusCountdown();
      }
    }, 1000);

    watchId = navigator.geolocation.watchPosition(function (pos) {
      if (!bestPos || pos.coords.accuracy < bestPos.coords.accuracy) {
        bestPos = pos;
      }
      updateStatusCountdown();

      if (pos.coords.accuracy <= TARGET_AKURASI_METER) {
        bersihkanWatch();
        btnGunakanLokasi.disabled = false;
        prosesLokasi(bestPos.coords.latitude, bestPos.coords.longitude, null);
      }
    }, function (err) {
      if (!bestPos) {
        bersihkanWatch();
        btnGunakanLokasi.disabled = false;
        statusEl.className = 'cl-status error';
        statusEl.textContent = 'Gagal mengambil lokasi. Coba gunakan input alamat manual di bawah.';
      }
    }, { enableHighAccuracy: true, timeout: MAX_TUNGGU_DETIK * 1000, maximumAge: 0 });

    var timeoutTimer = setTimeout(function () {
      bersihkanWatch();
      btnGunakanLokasi.disabled = false;
      if (bestPos) {
        prosesLokasi(bestPos.coords.latitude, bestPos.coords.longitude, null);
      } else {
        statusEl.className = 'cl-status error';
        statusEl.textContent = 'Gagal mengambil lokasi. Coba gunakan input alamat manual di bawah.';
      }
    }, MAX_TUNGGU_DETIK * 1000);
  });

  btnCariAlamat.addEventListener('click', function () {
    var alamat = inputAlamat.value.trim();
    if (!alamat) {
      statusEl.className = 'cl-status error';
      statusEl.textContent = 'Masukkan alamat terlebih dahulu.';
      return;
    }
    suggestionsEl.style.display = 'none';
    statusEl.className = 'cl-status';
    statusEl.textContent = 'Mencari alamat...';
    btnCariAlamat.disabled = true;

    cariAlamatNominatim(alamat, 1).then(function (data) {
      btnCariAlamat.disabled = false;
      if (data && data.length > 0) {
        prosesLokasi(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name);
      } else {
        tampilkanTombolLanjutTanpaPeta(alamat);
      }
    }).catch(function () {
      btnCariAlamat.disabled = false;
      tampilkanTombolLanjutTanpaPeta(alamat);
    });
  });

  function tampilkanTombolLanjutTanpaPeta(alamat) {
    statusEl.className = 'cl-status error';
    statusEl.innerHTML = 'Alamat tidak ditemukan di peta. ';

    var btnLanjut = document.createElement('button');
    btnLanjut.type = 'button';
    btnLanjut.className = 'cl-btn-secondary';
    btnLanjut.style.marginTop = '10px';
    btnLanjut.innerHTML = '<i class="fas fa-arrow-right"></i> Tetap Lanjutkan dengan Alamat Ini';
    btnLanjut.addEventListener('click', function () {
      prosesLokasiTanpaKoordinat(alamat);
    });

    // Hindari duplikat tombol kalau user klik cari berkali-kali
    var existing = document.getElementById('btn-lanjut-tanpa-peta');
    if (existing) existing.remove();
    btnLanjut.id = 'btn-lanjut-tanpa-peta';
    statusEl.parentNode.insertBefore(btnLanjut, statusEl.nextSibling);
  }

  btnGantiLokasi.addEventListener('click', function () {
    stepForm.style.display = 'none';
    stepLokasi.style.display = 'block';
    statusEl.textContent = '';
    statusEl.className = 'cl-status';
  });

  function tampilkanErrorForm(pesan) {
    var el = document.getElementById('cl-form-error');
    if (!el) {
      el = document.createElement('p');
      el.id = 'cl-form-error';
      el.className = 'cl-status error';
      el.style.marginTop = '10px';
      btnKirim.parentNode.insertBefore(el, btnKirim.nextSibling);
    }
    el.textContent = pesan;
  }

  btnKirim.addEventListener('click', function () {
    var nama = document.getElementById('cl-nama').value.trim();
    var wa = document.getElementById('cl-wa').value.trim().replace(/\D/g, '');

    // normalisasi nomor: 08xx / 8xx -> 628xx
    if (wa.indexOf('0') === 0) wa = '62' + wa.slice(1);
    else if (wa.indexOf('8') === 0) wa = '62' + wa;

    if (!nama || wa.length < 9) {
      tampilkanErrorForm(nama
        ? 'Nomor WhatsApp sepertinya belum benar. Contoh: 0812xxxxxxx.'
        : 'Mohon lengkapi nama dan nomor WhatsApp.');
      return;
    }
    document.getElementById('cl-wa').value = wa;

    btnKirim.disabled = true;
    btnKirim.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

    var mapsLink = (currentLat != null && currentLng != null)
      ? 'https://www.google.com/maps?q=' + currentLat + ',' + currentLng
      : '';
    var dataKirim = {
      timestamp: new Date().toISOString(),
      tipe: 'lengkap',
      nama: nama,
      whatsapp: wa,
      latitude: currentLat,
      longitude: currentLng,
      alamat: currentAlamatText || '',
      kotaTerdeteksi: currentKota || '',
      mapsLink: mapsLink,
      halaman: window.location.pathname,
      referrer: document.referrer || ''
    };

    function lanjutKeWA() {
      if (typeof gtag === 'function') {
        gtag('event', 'submit_cek_lokasi', {
          kota_terdeteksi: currentKota || 'unknown',
          page_path: window.location.pathname
        });
      }
      lsSet(LS_LEAD, { ts: Date.now() }); // lead didapat: matikan semua prompt lokasi permanen
      var pesan = 'Halo kak, saya ' + nama + ', mau cek ketersediaan XL SATU.\n' +
        (currentAlamatText ? 'Alamat: ' + currentAlamatText + '\n' : '') +
        (mapsLink ? 'Peta lokasi: ' + mapsLink + '\n' : '') +
        (currentKota ? 'Area terdekat: ' + currentKota : '');
      var waUrl = 'https://wa.me/' + NOMOR_WA_SALES + '?text=' + encodeURIComponent(pesan);
      window.open(waUrl, '_blank');
      modal.style.display = 'none';
      btnKirim.disabled = false;
      btnKirim.innerHTML = '<i class="fab fa-whatsapp"></i> Kirim & Lanjut ke WhatsApp';
    }

    if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.indexOf('GANTI_DENGAN') === -1) {
      fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(dataKirim)
      }).then(lanjutKeWA).catch(lanjutKeWA);
    } else {
      lanjutKeWA();
    }
  });

  // ============================================================
  // HYBRID LAYER: deteksi IP pasif + strip ajakan lokasi lunak
  // ============================================================
  var LS_KOTA = 'xlsr_kota_ip';
  var LS_SUPPRESS = 'xlsr_lokasi_strip_off';
  var LS_LEAD = 'xlsr_lead_done';

  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var KOTA_ALIASES = {
    'solo': 'Solo', 'surakarta': 'Solo', 'sukoharjo': 'Sukoharjo',
    'karanganyar': 'Karanganyar', 'klaten': 'Klaten', 'boyolali': 'Boyolali'
  };

  // -- Lapisan 0: IP geolocation (tanpa izin), cache 24 jam --
  function pakaiKotaIP(kota) {
    window.__xlsrKotaIP = kota;
    if (typeof gtag === 'function') {
      gtag('event', 'ip_kota_terdeteksi', { kota_ip: kota, page_path: location.pathname });
    }
  }
  (function deteksiKotaIP() {
    var c = lsGet(LS_KOTA);
    if (c && Date.now() - c.ts < 24 * 3600 * 1000) {
      if (c.kota) pakaiKotaIP(c.kota);
      return;
    }
    fetch('https://ipwho.is/')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.success || !d.city) return;
        var k = KOTA_ALIASES[String(d.city).toLowerCase().trim()];
        if (!k) { lsSet(LS_KOTA, { kota: '', ts: Date.now() }); return; } // di luar area: jangan retry terus
        lsSet(LS_KOTA, { kota: k, ts: Date.now() });
        pakaiKotaIP(k);
      })
      .catch(function () {});
  })();

  // -- Lapisan 1: strip ajakan (muncul setelah 12 dtk ATAU scroll >=40%, mana lebih dulu) --
  var stripDitampilkan = false, modalPernahDibuka = false;

  function bolehTampilkanStrip() {
    if (lsGet(LS_LEAD)) return false;                 // sudah jadi lead
    var off = lsGet(LS_SUPPRESS);
    if (off && Date.now() - off.ts < 7 * 24 * 3600 * 1000) return false; // ditutup <7 hari
    if (modal.style.display === 'flex') return false; // modal sedang terbuka
    return true;
  }

  function buatStrip() {
    var kota = window.__xlsrKotaIP;
    var s = document.createElement('div');
    s.id = 'xlsr-lokasi-strip';
    s.style.cssText = 'position:fixed; left:50%; transform:translateX(-50%);' +
      'bottom:calc(96px + env(safe-area-inset-bottom)); z-index:9998;' +
      'width:min(92%,440px); background:#0d7a5f; color:#fff; border-radius:14px;' +
      'padding:12px 14px; display:flex; align-items:center; gap:10px;' +
      'box-shadow:0 10px 30px rgba(0,0,0,.25); font-size:13.5px; line-height:1.4;';
    s.innerHTML =
      '<i class="fas fa-location-crosshairs" style="font-size:18px; flex-shrink:0;"></i>' +
      '<span style="flex:1;">' + (kota
        ? 'Kamu di area ' + kota + '? Aktifkan lokasi untuk cek ketersediaan cepat.'
        : 'Aktifkan lokasi untuk cek ketersediaan di areamu secara otomatis.') + '</span>' +
      '<button type="button" id="xlsr-strip-ya" style="background:#fff; color:#037e64; border:none;' +
        'border-radius:9px; padding:8px 12px; font-weight:700; font-size:13px; cursor:pointer; flex-shrink:0;">Cek</button>' +
      '<button type="button" id="xlsr-strip-no" aria-label="Tutup" style="background:none; border:none;' +
        'color:rgba(255,255,255,.75); font-size:20px; cursor:pointer; padding:2px 4px; flex-shrink:0;">&times;</button>';

    s.querySelector('#xlsr-strip-ya').addEventListener('click', function () {
      hapusStrip();
      lsSet(LS_SUPPRESS, { ts: Date.now() });
      if (!navigator.geolocation) {
        modal.style.display = 'flex';
        window.__loadLeaflet();
        return;
      }
      statusEl.textContent = 'Meminta izin lokasi...';
      navigator.geolocation.getCurrentPosition(function (pos) {
        modal.style.display = 'flex';
        window.__loadLeaflet();
        if (typeof gtag === 'function') {
          gtag('event', 'open_cek_lokasi', { page_path: location.pathname, trigger: 'strip' });
        }
        prosesLokasi(pos.coords.latitude, pos.coords.longitude, null);
      }, function () {
        // izin ditolak/gagal: arahkan ke modal jalur manual
        modal.style.display = 'flex';
        window.__loadLeaflet();
        statusEl.className = 'cl-status error';
        statusEl.textContent = 'Izin lokasi tidak diberikan. Gunakan alamat manual di bawah.';
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    });

    s.querySelector('#xlsr-strip-no').addEventListener('click', function () {
      hapusStrip();
      lsSet(LS_SUPPRESS, { ts: Date.now() });
      if (typeof gtag === 'function') {
        gtag('event', 'lokasi_strip_tutup', { page_path: location.pathname });
      }
    });

    document.body.appendChild(s);
  }

  function hapusStrip() {
    var el = document.getElementById('xlsr-lokasi-strip');
    if (el) el.remove();
    stripDitampilkan = false;
  }

  function mungkinTampilkanStrip() {
    if (stripDitampilkan || modalPernahDibuka) return;
    if (!bolehTampilkanStrip()) return;
    stripDitampilkan = true;
    buatStrip();
    if (typeof gtag === 'function') {
      gtag('event', 'lokasi_strip_muncul', { page_path: location.pathname });
    }
  }

  setTimeout(mungkinTampilkanStrip, 12000);
  window.addEventListener('scroll', function () {
    var progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress >= 0.4) mungkinTampilkanStrip();
  }, { passive: true });

  // sembunyikan strip saat modal dibuka lewat jalur mana pun; tandai sesi
  document.addEventListener('click', function (e) {
    if (e.target.closest('#btn-buka-cek-lokasi, .btn-cek-lokasi-trigger')) {
      modalPernahDibuka = true;
      hapusStrip();
    }
  }, true);

  // Enter di kolom form = kirim
  ['cl-nama', 'cl-wa'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); btnKirim.click(); }
    });
  });
})();

})();
