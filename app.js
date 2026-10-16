import * as Auth from './auth.js';
import { GRADES, UNITS, FINAL } from './data.js';
import { Viewer } from './viewer.js';
import { BUILD } from './models.js';
import { openSketchfab } from './sketchfab.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

let user = null, guest = false, prog = { xp: 0, done: {}, found: {}, match: {} }, viewer = null;

/* ---------- arka plan baloncukları ---------- */
(() => {
  const b = $('#bubbles');
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('i'), z = 14 + Math.random() * 50;
    s.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;animation-duration:${12 + Math.random() * 16}s;animation-delay:${-Math.random() * 20}s`;
    b.appendChild(s);
  }
})();

/* ---------- ilerleme ---------- */
const key = () => 'nasse:' + (user ? user.uid : 'misafir');
function loadProg() {
  try { prog = JSON.parse(localStorage.getItem(key())) || {}; } catch { prog = {}; }
  prog.xp = prog.xp || 0; prog.done = prog.done || {}; prog.found = prog.found || {}; prog.match = prog.match || {};
}
const saveProg = () => localStorage.setItem(key(), JSON.stringify(prog));
const addXp = n => { prog.xp += n; saveProg(); const x = $('#xp'); if (x) x.textContent = '⭐ ' + prog.xp; };

/* ---------- eğlence ---------- */
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }
function confetti(n = 40) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i'); s.className = 'cf';
    s.style.left = Math.random() * 100 + 'vw'; s.style.background = `hsl(${140 + Math.random() * 90} 90% 60%)`;
    s.style.animationDuration = 1.2 + Math.random() * 1.4 + 's'; s.style.setProperty('--dx', Math.random() * 120 - 60 + 'px');
    document.body.appendChild(s); setTimeout(() => s.remove(), 2800);
  }
}
function cleanup() { if (viewer) { viewer.dispose(); viewer = null; } }

/* ---------- giriş ---------- */
function login() {
  cleanup();
  app.innerHTML = `
  <section class="login">
    <div class="logo float">🧬</div>
    <h1 class="title">Nasse <span>Biology</span></h1>
    <p class="sub">Sinir sistemini 3B keşfet, oyna, öğren!</p>
    <div class="card glass">
      <button id="gbtn" class="btn google">🔵 Google ile giriş yap</button>
      <div class="or">veya e-posta ile</div>
      <input id="nm" type="text" placeholder="Adın (kayıt olurken)" autocomplete="name">
      <input id="em" type="email" placeholder="E-posta" autocomplete="email">
      <input id="pw" type="password" placeholder="Şifre (en az 6 karakter)" autocomplete="current-password">
      <div class="row"><button id="lg" class="btn">Giriş yap</button><button id="rg" class="btn alt">Kayıt ol</button></div>
      <button id="fp" class="link">Şifremi unuttum</button>
      <button id="gs" class="link">Misafir olarak devam et</button>
      <p id="msg" class="msg"></p>
    </div>
    <footer class="credit"><b>– Los Galacticos –</b><span>– Barış Köseoğlu –</span></footer>
  </section>`;
  const msg = t => { $('#msg').style.color = '#fca5a5'; $('#msg').textContent = t; };
  const run = fn => async () => { msg(''); try { await fn(); } catch (e) { msg(Auth.trErr(e.code)); } };
  $('#gbtn').onclick = run(() => Auth.googleLogin());
  $('#lg').onclick = run(() => Auth.emailLogin($('#em').value.trim(), $('#pw').value));
  $('#rg').onclick = run(() => Auth.emailRegister($('#nm').value.trim(), $('#em').value.trim(), $('#pw').value));
  $('#fp').onclick = run(async () => { await Auth.resetPassword($('#em').value.trim()); $('#msg').style.color = '#86efac'; $('#msg').textContent = 'Şifre sıfırlama bağlantısı e-postana gönderildi.'; });
  $('#gs').onclick = () => { guest = true; user = { uid: 'misafir', name: 'Misafir' }; loadProg(); home(); };
}

/* ---------- ana menü ---------- */
function home() {
  cleanup();
  const total = Object.keys(UNITS).length, doneN = Object.keys(prog.done).filter(k => UNITS[k]).length, open = doneN >= total;
  app.innerHTML = `
  <header class="top"><div>👋 <b>${esc(user.name)}</b></div><div class="xp" id="xp">⭐ ${prog.xp}</div><button id="out" class="ghost">Çıkış</button></header>
  <h1 class="title sm">Nasse <span>Biology</span></h1>
  <p class="lead">Bir sınıf seç ve sinir sisteminin 3B dünyasına dal!</p>
  <div class="grid">
    ${GRADES.map(g => `<button class="gcard ${g.color}" data-g="${g.id}"><span class="em float">${g.emoji}</span><h3>${g.title}</h3><p>${g.desc}</p><small>${g.units.filter(u => prog.done[u]).length}/${g.units.length} bölüm tamamlandı</small></button>`).join('')}
    <button class="gcard final ${open ? '' : 'locked'}" id="fin"><span class="em float">🏆</span><h3>Son Aşama</h3><p>Bağlam Macerası</p><small>${open ? 'Hazır! Maceraya başla' : '🔒 Önce tüm bölümleri bitir (' + doneN + '/' + total + ')'}</small></button>
  </div>`;
  $$('.gcard[data-g]').forEach(b => b.onclick = () => grade(+b.dataset.g));
  $('#fin').onclick = () => open ? finalIntro() : toast('Önce 9, 10 ve 11. sınıf bölümlerini bitir!');
  $('#out').onclick = async () => { await Auth.logout(); guest = false; user = null; login(); };
}

/* ---------- sınıf ---------- */
function grade(id) {
  cleanup(); const g = GRADES.find(x => x.id === id);
  app.innerHTML = `
  <header class="top"><button id="bk" class="ghost">← Geri</button><h2>${g.title}</h2><div class="xp" id="xp">⭐ ${prog.xp}</div></header>
  <div class="list">${g.units.map(u => { const d = UNITS[u], s = prog.done[u] || 0; return `<button class="ucard" data-u="${u}"><span class="em float">${d.emoji}</span><div><h3>${d.title}</h3><p>🎯 ${d.goal}</p></div><b>${s ? '⭐'.repeat(s) : '▶'}</b></button>`; }).join('')}</div>`;
  $('#bk').onclick = home; $$('.ucard').forEach(b => b.onclick = () => unit(b.dataset.u));
}

/* ---------- bölüm: 3B keşif ---------- */
function unit(id) {
  cleanup(); const u = UNITS[id]; let cur = null, built = null, parts = [];
  const chips = [...u.models.map(m => ({ k: m.id, l: m.label })), ...(u.sketch ? [{ k: 'sk', l: '🔍 ' + u.sketch.label }] : [])];
  app.innerHTML = `
  <header class="top"><button id="bk" class="ghost">← Geri</button><h2>${u.emoji} ${u.title}</h2><div class="xp" id="xp">⭐ ${prog.xp}</div></header>
  <div class="goal glass">🎯 ${u.goal}</div>
  <div class="layout">
    <div>
      <div class="chips" id="chips">${chips.map(c => `<button class="chip" data-k="${c.k}">${c.l}</button>`).join('')}</div>
      <div class="stage"><div id="view"></div><div id="sk"></div><div class="hint">👆 Döndür · 🤏 Yakınlaştır · 👉 Parçaya dokun · çift dokun: sıfırla</div></div>
      <div class="tools" id="tools"><button id="auto" class="ghost">🔄 Otomatik dönme
