/* ============================================================
   Cookie Consent & Google Consent Mode v2 — xlsatusolo.com
   - Default: analytics DENIED (diset sebelum gtag config di <head>)
   - Banner muncul hanya jika pengunjung belum memilih
   - Pilihan disimpan di localStorage, berlaku sampai dihapus manual
   ============================================================ */
(function () {
  var KEY = 'xlsr_cookie_consent';

  function lsGet() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function lsSet(v) { try { localStorage.setItem(KEY, JSON.stringify({ v: v, ts: Date.now() })); } catch (e) {} }

  function applyConsent(v) {
    if (typeof gtag === 'function') {
      var g = v === 'granted' ? 'granted' : 'denied';
      gtag('consent', 'update', {
        analytics_storage: g,
        ad_storage: g,
        ad_user_data: g,
        ad_personalization: g
      });
    }
  }

  var saved = lsGet();
  if (saved && saved.v) { applyConsent(saved.v); return; }

  function render() {
    var b = document.createElement('div');
    b.id = 'xlsr-consent';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Persetujuan cookie');
    b.style.cssText = 'position:fixed; left:16px; bottom:16px; z-index:10001; max-width:min(92vw,360px);' +
      'background:#fff; border:1px solid #e5e7eb; border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,.18);' +
      'padding:16px 18px; font-size:13px; line-height:1.55; color:#333; font-family:inherit;';
    b.innerHTML =
      '<strong style="display:block; margin-bottom:4px; color:#1a1a1a;">Bantu tingkatkan layanan?</strong>' +
      'Izinkan analitik & iklan untuk bantu akurasi cek area dan kecepatan situs. Tidak ada data yang dijual. Detail: ' +
      '<a href="/kebijakan-privasi/" style="color:#037e64; font-weight:600;">Kebijakan Privasi</a>.' +
      '<div style="display:flex; gap:8px; margin-top:12px;">' +
      '<button type="button" id="xlsr-c-ok" style="flex:1.2; background:#037e64; color:#fff; border:none; padding:9px 10px; border-radius:8px; font-weight:700; font-size:12.5px; cursor:pointer; font-family:inherit;">Izinkan</button>' +
      '<button type="button" id="xlsr-c-no" style="flex:1; background:#f5f5f5; color:#444; border:1px solid #ddd; padding:9px 10px; border-radius:8px; font-weight:600; font-size:12.5px; cursor:pointer; font-family:inherit;">Hanya Esensial</button>' +
      '</div>';
    document.body.appendChild(b);
    b.querySelector('#xlsr-c-ok').addEventListener('click', function () { lsSet('granted'); applyConsent('granted'); b.remove(); });
    b.querySelector('#xlsr-c-no').addEventListener('click', function () { lsSet('denied'); applyConsent('denied'); b.remove(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
