let loading = null;
function loadScript() {
  if (loading) return loading;
  loading = new Promise((res, rej) => {
    if (window.Sketchfab) return res();
    const s = document.createElement('script');
    s.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  return loading;
}

export async function openSketchfab(box, uid, keys, show) {
  box.innerHTML = '<iframe title="3B model" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>';
  const frame = box.firstChild;
  try { await loadScript(); } catch { show({ t: 'Bağlantı sorunu', d: 'Sketchfab yüklenemedi. İnternet bağlantını kontrol et.' }); return; }
  const client = new window.Sketchfab('1.12.1', frame);
  client.init(uid, {
    ui_theme: 'dark', autostart: 1, ui_infos: 0, ui_watermark: 0, preload: 1,
    success(api) {
      api.start();
      api.addEventListener('viewerready', () => {
        let nodes = {};
        api.getNodeMap((e, m) => { if (!e) nodes = m; });
        api.addEventListener('click', info => {
          if (!info) return;
          const n = (nodes[info.instanceID] && nodes[info.instanceID].name) || '';
          const m = (info.material && info.material.name) || '';
          const name = (n + ' ' + m).trim();
          const hit = keys.find(k => new RegExp(k[0], 'i').test(name));
          console.log('Sketchfab parça adı:', name);
          show(hit ? { t: hit[1], d: hit[2] } : { t: 'Seçilen parça', d: 'Parça adı: ' + (name || 'bilinmiyor') + '. Bu parça için henüz Türkçe kart eklenmedi; data.js içindeki anahtar listesine ekleyebilirsin.' });
        }, { pick: 'fast' });
      });
    },
    error() { show({ t: 'Model açılamadı', d: 'Bu model gömülmeye izin vermiyor olabilir. 3B Hayvan Hücresi / Nöron sekmelerindeki kendi modelimizi kullanabilirsin.' }); }
  });
}
