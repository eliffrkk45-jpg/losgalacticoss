import * as THREE from 'three';

/* ---------- yardımcılar ---------- */
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const I = (t, d) => ({ t, d });
const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.42, metalness: 0.08, ...o });
const glass = (c, op = 0.22) => new THREE.MeshPhysicalMaterial({ color: c, transparent: true, opacity: op, roughness: 0.15, depthWrite: false });
const sph = (r, s = 28) => new THREE.SphereGeometry(r, s, Math.max(12, (s * 0.75) | 0));
const ell = (sx, sy, sz, s = 32) => { const g = new THREE.SphereGeometry(1, s, Math.max(12, (s * 0.75) | 0)); g.scale(sx, sy, sz); return g; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => 1 - Math.pow(1 - x, 3);

function add(p, geo, m, pos = [0, 0, 0], info = null, ud = {}) {
  const o = new THREE.Mesh(geo, m); o.position.set(...pos);
  if (info) o.userData.info = info; Object.assign(o.userData, ud); p.add(o); return o;
}
function tube(p, pts, r, m, info, seg = 48) {
  const c = new THREE.CatmullRomCurve3(pts.map(a => (a.isVector3 ? a : new THREE.Vector3(...a))));
  const o = new THREE.Mesh(new THREE.TubeGeometry(c, seg, r, 10, false), m);
  if (info) o.userData.info = info; p.add(o); return o;
}
function label(text, parent, pos, sc = 1.6, color = '#ffffff') {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const x = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const draw = t => {
    x.clearRect(0, 0, 512, 128); x.font = '800 54px Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 10; x.strokeStyle = 'rgba(3,26,51,.85)'; x.strokeText(t, 256, 64); x.fillStyle = color; x.fillText(t, 256, 64); tex.needsUpdate = true;
  };
  draw(text);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  s.scale.set(sc * 2, sc * 0.5, 1); s.position.set(...pos); s.renderOrder = 10; s.userData.set = draw; parent.add(s); return s;
}

/* ===================== HÜCRE ===================== */
function buildCell() {
  const g = new THREE.Group(), R = rng(11);
  add(g, sph(3, 48), glass(0x38bdf8, 0.16), [0, 0, 0], I('Hücre zarı (plazma zarı)', 'Fosfolipit çift katman ve proteinlerden oluşur (akıcı mozaik model). Seçici geçirgendir ve madde alışverişini denetler. Nöronda zarın kanal ve pompaları impulsun temelidir.'), { shell: true });
  add(g, sph(2.9, 40), glass(0x34d399, 0.1), [0, 0, 0], I('Sitoplazma', 'Organelleri çevreleyen sıvı ortamdır. Glikoliz burada gerçekleşir; birçok kimyasal tepkime burada yürür.'), { shell: true });
  const PR = I('Zar proteini', 'Kanal ve taşıyıcı proteinler maddelerin zardan geçişini sağlar. Nöronda Na⁺ ve K⁺ kanalları ile Na⁺/K⁺ pompası bu proteinlerdendir.');
  for (let i = 0; i < 18; i++) {
    const y = 1 - (2 * (i + 0.5)) / 18, r = Math.sqrt(1 - y * y), th = i * 2.399963, n = V(Math.cos(th) * r, y, Math.sin(th) * r);
    const m = add(g, new THREE.CylinderGeometry(0.13, 0.13, 0.5, 10), mat(0xf472b6), [n.x * 3, n.y * 3, n.z * 3], PR);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), n);
  }
  add(g, sph(1, 36), mat(0x7c3aed, { roughness: 0.55 }), [-0.3, 0.4, 0], I('Çekirdek', 'Hücrenin yönetim merkezidir. DNA burada bulunur ve hücrenin tüm faaliyetlerini yönetir. Olgun nöronlar bölünmez.'));
  add(g, sph(0.38, 20), mat(0xc4b5fd), [-0.045, 0.57, 0.79], I('Çekirdekçik', 'Ribozom yapımında görevli bölgedir; çekirdeğin içinde yer alır.'));
  const ER = new THREE.Group(); ER.position.set(-0.3, 0.4, 0);
  ER.userData.info = I('Endoplazmik retikulum', 'Zar kanalları ağıdır. Üzerinde ribozom bulunan türü (granüllü ER) protein sentezine yardım eder; madde taşınmasını sağlar.');
  for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1.3 + i * 0.2, 0.07, 10, 48, Math.PI * 1.4), mat(0x2dd4bf)); m.rotation.set(i * 0.9, i * 1.3, i * 0.4); ER.add(m); }
  g.add(ER);
  const GO = new THREE.Group(); GO.position.set(1.7, -0.4, -1.1); GO.rotation.z = 0.5;
  GO.userData.info = I('Golgi cisimciği', 'Yassı kesecik yığınıdır. Maddeleri paketler, değiştirir ve salgı keseciklerine ayırır. Nörotransmitter keseciklerinin hazırlanmasına da katkı sağlar.');
  for (let i = 0; i < 5; i++) add(GO, ell(0.75 - i * 0.04, 0.1, 0.5, 20), mat(0xfacc15), [0, i * 0.22 - 0.45, 0]);
  g.add(GO);
  const MI = I('Mitokondri', 'Oksijenli solunumla ATP üretir; hücrenin enerji santralidir. Nöronlarda çok sayıda bulunur çünkü sinir hücresi çok enerji harcar.');
  [[1.6, 0.8, 0.8], [1.5, -1, 1.2], [-1.7, -0.9, 1], [0.5, 1.7, -1.3]].forEach(p => { const m = add(g, new THREE.CapsuleGeometry(0.22, 0.55, 6, 14), mat(0xfb7185), p, MI); m.rotation.set(R() * 3, R() * 3, R() * 3); });
  const LY = I('Lizozom', 'Sindirim enzimleri taşır; hücre içi sindirimi yapar ve yaşlanmış organelleri parçalar.');
  [[-1.6, 1.2, 0.9], [0.2, -1.8, 0.7], [-0.8, 1.5, -1.4]].forEach(p => add(g, sph(0.2, 16), mat(0xfde047, { emissive: 0x854d0e, emissiveIntensity: 0.3 }), p, LY));
  const rb = new THREE.InstancedMesh(sph(0.07, 8), mat(0xf1f5f9), 70), d = new THREE.Object3D(); let k = 0;
  while (k < 70) { const p = V(R() * 5 - 2.5, R() * 5 - 2.5, R() * 5 - 2.5); if (p.length() < 2.6 && p.distanceTo(V(-0.3, 0.4, 0)) > 1.15) { d.position.copy(p); d.updateMatrix(); rb.setMatrixAt(k++, d.matrix); } }
  rb.userData.info = I('Ribozom', 'Protein sentezinin yapıldığı küçük yapılardır. Zarsızdır; sitoplazmada serbest veya ER üzerinde bulunur.'); g.add(rb);
  const CE = new THREE.Group(); CE.position.set(-1.9, -0.5, 0.9);
  CE.userData.info = I('Sentrozom (sentriyol)', 'Hayvan hücrelerinde bölünme sırasında iğ ipliklerinin oluşumunda görev alır.');
  add(CE, new THREE.CylinderGeometry(0.07, 0.07, 0.4, 10), mat(0x60a5fa)); const c2 = add(CE, new THREE.CylinderGeometry(0.07, 0.07, 0.4, 10), mat(0x60a5fa), [0.15, -0.1, 0]); c2.rotation.z = Math.PI / 2;
  g.add(CE);
  return { group: g, api: {} };
}

/* ===================== NÖRON ===================== */
function buildNeuron(kind) {
  const g = new THREE.Group(), R = rng(5);
  const C = { myelinated: { my: 1, dn: 6, L: 10 }, unmyelinated: { my: 0, dn: 6, L: 10 }, motor: { my: 1, dn: 7, L: 10, musc: 1 }, sensory: { my: 1, sens: 1, L: 10 }, inter: { my: 0, dn: 10, L: 3.6 } }[kind];
  const L = C.L, sx = -L / 2, ex = L / 2;
  const axM = mat(0x93c5fd), dnM = mat(0x2dd4bf), myM = mat(0xf8fafc, { roughness: 0.3 }), ndM = mat(0xfacc15), enM = mat(0x34d399);
  const sp = C.sens ? V(sx + 2.4, 1.5, 0) : V(sx, 0, 0);
  add(g, sph(0.95, 36), glass(0x2dd4bf, 0.5), [sp.x, sp.y, sp.z], I('Hücre gövdesi (soma)', 'Çekirdek ve organellerin bulunduğu bölgedir. Protein ve nörotransmitter yapımı burada olur; dendritlerden gelen uyarılar burada toplanır.'), { shell: true });
  add(g, sph(0.42, 24), mat(0x7c3aed), [sp.x, sp.y, sp.z], I('Çekirdek', 'Nöronun yönetim merkezidir; genetik bilgiyi taşır.'));
  const DEN = I('Dendrit', 'Kısa ve dallı uzantılardır. Reseptörlerden veya diğer nöronlardan gelen uyarıları alıp hücre gövdesine taşır. Dallanma, uyarı alma yüzeyini artırır.');
  if (!C.sens) {
    for (let i = 0; i < C.dn; i++) {
      const a = Math.PI / 2 + ((i + 0.5) / C.dn) * Math.PI, b = i * 2.4;
      const d = V(Math.cos(a), Math.sin(a) * Math.cos(b), Math.sin(a) * Math.sin(b)).normalize();
      const p0 = sp.clone().addScaledVector(d, 0.9), p1 = p0.clone().addScaledVector(d, 0.9).add(V(R() * 0.3 - 0.15, R() * 0.3 - 0.15, R() * 0.3 - 0.15));
      const p2 = p1.clone().addScaledVector(d, 0.6);
      tube(g, [p0, p1.clone().lerp(p0, 0.5), p1], 0.1, dnM, DEN, 16);
      let s = d.clone().cross(V(0, 0, 1)); if (s.length() < 0.1) s = d.clone().cross(V(0, 1, 0)); s.normalize();
      [1, -1].forEach(q => { const e = p1.clone().addScaledVector(d, 0.65).addScaledVector(s, 0.5 * q); tube(g, [p1, p1.clone().lerp(e, 0.5), e], 0.06, dnM, DEN, 12); });
    }
  } else {
    const J = V(sx + 2.4, 0, 0);
    tube(g, [[sx - 1.2, 0, 0], [sx + 0.6, 0, 0], J], 0.14, dnM, I('Dendrit (uzun)', 'Duyu nöronunda dendrit uzundur; uyarıyı reseptörden hücre gövdesinin yanından geçirerek akson tarafına taşır.'));
    add(g, sph(0.3, 16), mat(0xfb923c), [sx - 1.35, 0, 0], I('Reseptör ucu', 'Uyarının alındığı serbest uçtur. Reseptör, uyarıyı impulsa çevirir.'));
    tube(g, [J, V(J.x, 0.7, 0), sp], 0.1, dnM, I('Hücre gövdesine bağlantı', 'Duyu nöronunda hücre gövdesi, dendrit ve aksonun geçtiği yolun yan tarafında yer alır.'));
  }
  let xs;
  if (!C.sens) {
    xs = sp.x + 1.1;
    const h = add(g, new THREE.ConeGeometry(0.38, 0.7, 20), mat(0x38bdf8), [sp.x + 1.25, 0, 0], I('Akson tepeciği', 'İmpulsun başladığı bölgedir. Eşik değerine ilk burada ulaşılır.')); h.rotation.z = -Math.PI / 2;
  } else xs = sx + 2.6;
  tube(g, [[xs, 0, 0], [ex, 0, 0]], 0.13, axM, I('Akson', 'İmpulsu hücre gövdesinden uzaklaştıran uzun uzantıdır. Çoğu nöronda tek akson bulunur.'), 80);
  const nodes = [];
  if (C.my) {
    const n = Math.floor((ex - 1.1 - xs) / 1.3);
    for (let i = 0; i < n; i++) {
      const sg = new THREE.CapsuleGeometry(0.3, 0.4, 6, 16); sg.rotateZ(Math.PI / 2);
      add(g, sg, myM, [xs + i * 1.3 + 0.5, 0, 0], I('Miyelin kılıf', 'Yağ yapılı yalıtkan kılıftır; periferde Schwann hücreleri, MSS’de oligodendrositler oluşturur. İmpuls iletimini hızlandırır.'));
      const ng = new THREE.CylinderGeometry(0.17, 0.17, 0.32, 16); ng.rotateZ(Math.PI / 2);
      const nx = xs + i * 1.3 + 1.15; nodes.push(nx);
      add(g, ng, ndM, [nx, 0, 0], I('Ranvier boğumu', 'Miyelin kılıfın kesintiye uğradığı boşluklardır. İmpuls bu boğumlar arasında sıçrar (sıçramalı iletim).'));
    }
  }
  const EN = I('Akson ucu (sinaptik uç)', 'Akson dallanarak uçlarda küçük şişkinliklerle biter. Burada nörotransmitter salınır ve impuls diğer hücreye aktarılır.');
  [[1, 0.6, 0], [1, -0.6, 0], [1, 0, 0.6], [1, 0, -0.6]].forEach(o => {
    const e = V(ex + o[0], o[1], o[2]); tube(g, [V(ex, 0, 0), V(ex + 0.5, o[1] * 0.5, o[2] * 0.5), e], 0.07, enM, EN, 14); add(g, sph(0.2, 16), enM, [e.x, e.y, e.z], EN);
  });
  if (C.musc) add(g, new THREE.BoxGeometry(1, 2.6, 2.6), mat(0xef4444, { roughness: 0.7 }), [ex + 1.9, 0, 0], I('Kas (efektör)', 'Motor nöronun emrini uygulayan yapıdır. Kas hücresi impulsla kasılır.'));
  g.userData.axon = { xs, ex, nodes };
  return { group: g, api: {} };
}

/* ===================== BEYİN ===================== */
function wrinkled(geo, amp = 0.07, f = 6) {
  const p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const n = v.clone().normalize();
    const d = Math.sin(n.x * f * 1.3 + n.y * f) * Math.cos(n.y * f * 1.1 + n.z * f * 0.9) * amp + Math.sin(n.z * f * 1.7 + n.x * f * 0.5) * amp * 0.6;
    v.addScaledVector(n, d); p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals(); return geo;
}
function buildBrain() {
  const g = new THREE.Group();
  const lobe = (sx, sy, sz, f = 6, a = 0.07) => wrinkled(ell(sx, sy, sz, 64), a, f);
  add(g, lobe(1.2, 1.0, 1.25), mat(0x3b82f6, { roughness: 0.6 }), [1.0, 0.25, 0], I('Ön lob (frontal)', 'Düşünme, planlama, karar verme, kişilik ve istemli hareketlerin başlatılması bu lobun görevidir. Konuşmanın motor yönetimi de burada yapılır.'), { out: V(1.3, 0.3, 0) });
  add(g, lobe(1.1, 0.85, 1.2), mat(0x10b981, { roughness: 0.6 }), [-0.1, 0.78, 0], I('Tepe lobu (parietal)', 'Dokunma, basınç, sıcaklık ve ağrı duyularının algılandığı bölgedir. Uzaysal algıda da görev alır.'), { out: V(0, 1.3, 0) });
  add(g, lobe(0.8, 0.8, 1.05), mat(0x6366f1, { roughness: 0.6 }), [-1.5, 0.05, 0], I('Ense lobu (oksipital)', 'Görme merkezidir. Gözlerden gelen impulslar burada yorumlanır.'), { out: V(-1.4, 0.2, 0) });
  const TE = I('Şakak lobu (temporal)', 'İşitme, koku, bellek ve dil anlama ile ilgilidir.');
  add(g, lobe(1.25, 0.5, 0.55), mat(0x06b6d4, { roughness: 0.6 }), [0.3, -0.55, 0.95], TE, { out: V(0.3, -0.5, 1.3) });
  add(g, lobe(1.25, 0.5, 0.55), mat(0x06b6d4, { roughness: 0.6 }), [0.3, -0.55, -0.95], TE, { out: V(0.3, -0.5, -1.3) });
  add(g, lobe(0.8, 0.5, 0.95, 14, 0.05), mat(0x84cc16, { roughness: 0.65 }), [-1.3, -0.9, 0], I('Beyincik', 'Denge, vücut duruşu ve kas koordinasyonunu sağlar. Hareketlerin düzgün ve akıcı olmasından sorumludur.'), { out: V(-1.3, -1, 0) });
  add(g, new THREE.CylinderGeometry(0.3, 0.27, 0.5, 20), mat(0xf59e0b), [0.15, -0.75, 0], I('Orta beyin', 'Beyin sapının bölümüdür. Göz hareketleri ile görsel ve işitsel reflekslerde rol alır.'), { out: V(1.0, -0.2, 0) });
  add(g, ell(0.42, 0.34, 0.42, 20), mat(0xfb923c), [0.1, -1.15, 0], I('Pons (köprü)', 'Beyin ile beyincik arasında bağlantı kurar ve solunumun düzenlenmesine yardım eder.'), { out: V(1.2, -0.7, 0) });
  const om = add(g, new THREE.CylinderGeometry(0.22, 0.17, 0.9, 20), mat(0xf97316), [0.05, -1.75, 0], I('Omurilik soğanı', 'Kalp atışı, solunum, yutma, öksürme ve kusma gibi yaşamsal reflekslerin merkezidir. Omuriliğe bağlanır.'), { out: V(1.2, -1.3, 0) }); om.rotation.z = 0.08;
  g.userData.view = V(0.15, 0.1, 1);
  return { group: g, api: {} };
}

/* ===================== OMURİLİK KESİTİ ===================== */
function buildSpinal() {
  const g = new THREE.Group();
  const E2 = (rx, ry, dep) => { const s = new THREE.Shape(); s.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0); const gm = new THREE.ExtrudeGeometry(s, { depth: dep, bevelEnabled: false, curveSegments: 40 }); gm.translate(0, 0, -dep / 2); return gm; };
  const RG = (ro, ri, dep) => { const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false); const h = new THREE.Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h); const gm = new THREE.ExtrudeGeometry(s, { depth: dep, bevelEnabled: false, curveSegments: 56 }); gm.translate(0, 0, -dep / 2); return gm; };
  add(g, E2(1.55, 1.55, 1), mat(0xf1f5f9, { roughness: 0.7 }), [0, 0, 0], I('Beyaz madde', 'Miyelinli aksonlardan oluşur. Beyne çıkan ve beyinden inen impuls yollarını taşır. Miyelin nedeniyle beyaz görünür.'));
  const GR = mat(0x94a3b8, { roughness: 0.7 });
  add(g, E2(0.6, 0.4, 1.04), GR, [0, 0.02, 0], I('Gri madde (kelebek)', 'Nöron hücre gövdeleri, miyelinsiz aksonlar ve ara nöronlar burada bulunur. Refleks merkezidir.'));
  [1, -1].forEach(s => {
    const d = add(g, E2(0.2, 0.78, 1.04), GR, [s * 0.5, 0.62, 0], I('Dorsal (arka) boynuz', 'Dorsal kökten giren duyu nöronlarının impulslarını alır ve ara nöronlara aktarır.')); d.rotation.z = -s * 0.3;
    add(g, E2(0.5, 0.42, 1.04), GR, [s * 0.7, -0.5, 0], I('Ventral (ön) boynuz', 'Kasları yöneten motor nöronların hücre gövdelerini içerir.'));
  });
  add(g, new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12).rotateX(Math.PI / 2), mat(0x38bdf8), [0, 0.05, 0], I('Merkezi kanal', 'Omuriliğin ortasındaki dar kanaldır; beyin-omurilik sıvısı ile doludur.'));
  add(g, RG(1.62, 1.55, 1), mat(0xf472b6), [0, 0, 0], I('Pia mater (ince zar)', 'Omurilik yüzeyine yapışık en iç zardır; kan damarlarını taşır.'));
  add(g, RG(1.78, 1.62, 1), glass(0x7dd3fc, 0.4), [0, 0, 0], I('Beyin-omurilik sıvısı', 'Subaraknoid aralıkta bulunur; omuriliği darbelerden korur, besler ve atıkları uzaklaştırır.'));
  add(g, RG(1.86, 1.78, 1), mat(0xfde68a), [0, 0, 0], I('Araknoid (orta zar)', 'Örümcek ağı gibi ince zardır; pia ile dura arasında yer alır.'));
  add(g, RG(2.05, 1.9, 1), mat(0x3b82f6), [0, 0, 0], I('Dura mater (dış zar)', 'En dıştaki sert ve kalın koruyucu zardır.'));
  [1, -1].forEach(s => {
    const m = p => p.map(a => [a[0] * s, a[1], 0]);
    tube(g, m([[0.7, 1.0], [1.3, 1.9], [2.0, 2.4]]), 0.11, mat(0x38bdf8), I('Dorsal kök (duyu kökü)', 'Duyu nöronlarının aksonları bu kökten omuriliğe girer.'));
    add(g, sph(0.3, 20), mat(0xf59e0b), [s * 2.1, 2.45, 0], I('Dorsal kök gangliyonu', 'Duyu nöronlarının hücre gövdelerinin toplandığı şişkinliktir.'));
    tube(g, m([[0.9, -0.8], [1.8, -1.4], [2.8, -0.8], [3.3, 1.2]]), 0.11, mat(0x34d399), I('Ventral kök (motor kök)', 'Motor nöronların aksonları bu kökten omurilikten çıkar ve kas veya beze gider.'));
    tube(g, m([[2.2, 2.35], [2.8, 1.8], [3.3, 1.2], [4.0, 0.5]]), 0.17, mat(0xfde68a), I('Spinal sinir', 'Dorsal ve ventral köklerin birleşmesiyle oluşur. Hem duyu hem motor lif içerdiği için karışık sinirdir.'));
  });
  g.userData.view = V(0, 0.1, 1);
  return { group: g, api: {} };
}

/* ===================== RESEPTÖRLER ===================== */
function buildReceptors() {
  const g = new THREE.Group(); const mol = [], tk = {};
  add(g, new THREE.CylinderGeometry(5.3, 5.3, 0.15, 64), glass(0x0ea5e9, 0.25), [0, -0.12, 0]);
  const sta = (i, name) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2, s = new THREE.Group();
    s.position.set(Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6); g.add(s);
    add(s, new THREE.CylinderGeometry(1.05, 1.2, 0.3, 40), mat(0x0f766e, { metalness: 0.3 }));
    label(name, s, [0, 3.5, 0], 1.7, '#a7f3d0'); return s;
  };
  { // kemo
    const s = sta(0, 'Kemoreseptör'), K = I('Kemoreseptör', 'Kimyasal uyarıları algılar. Burun (koku) ve dilde (tat) bulunur; ayrıca kandaki CO₂ ve pH değişimini de algılar. Molekül reseptöre bağlanınca impuls oluşur.');
    add(s, new THREE.SphereGeometry(0.6, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0xa78bfa, { side: THREE.DoubleSide }), [0, 0.95, 0], K);
    add(s, new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12), mat(0xfb923c), [0, 0.45, 0], K);
    [0xfacc15, 0xf472b6, 0x4ade80, 0x60a5fa].forEach((c, i) => mol.push(add(s, sph(0.14, 14), mat(c, { emissive: c, emissiveIntensity: 0.3 }), [(i - 1.5) * 0.28, 1.9, 0], I('Kimyasal molekül', 'Kemoreseptörü uyaran madde. Örneğin koku molekülleri burun boşluğundaki reseptörlere bağlanır.'))));
  }
  { // mekano
    const s = sta(1, 'Mekanoreseptör'), M = I('Mekanoreseptör (Pacini cisimciği)', 'Dokunma, basınç ve titreşim gibi mekanik uyarıları algılar. Soğan gibi katmanlı yapısı basıncı sinir ucuna iletir.');
    for (let i = 0; i < 4; i++) add(s, ell(0.75 - i * 0.16, 1.05 - i * 0.2, 0.75 - i * 0.16, 24), glass(0xfbbf24, 0.35), [0, 1.35, 0], M);
    tube(s, [[0, 0.3, 0], [0, 1.4, 0]], 0.07, mat(0xffffff), M, 12);
    tk.finger = add(s, new THREE.CapsuleGeometry(0.22, 0.5, 6, 12), mat(0xfcd9b6), [0, 2.7, 0], I('Parmak (basınç uyarısı)', 'Deriye uygulanan basınç mekanoreseptörleri uyarır.'));
  }
  { // termo
    const s = sta(2, 'Termoreseptör'), T = I('Termoreseptör', 'Sıcaklık değişimini algılar. Sıcağa ve soğuğa duyarlı ayrı reseptörler vardır; deride yaygındır.');
    add(s, new THREE.CylinderGeometry(0.17, 0.17, 1.8, 16), glass(0xe0f2fe, 0.4), [0, 1.15, 0], T);
    add(s, sph(0.3, 20), mat(0xef4444), [0, 0.5, 0], T);
    const lg = new THREE.CylinderGeometry(0.1, 0.1, 1, 12); lg.translate(0, 0.5, 0);
    tk.liq = add(s, lg, mat(0xef4444, { emissive: 0x991b1b, emissiveIntensity: 0.4 }), [0, 0.55, 0], T);
    const ice = add(s, new THREE.BoxGeometry(0.4, 0.4, 0.4), mat(0x7dd3fc, { transparent: true, opacity: 0.8 }), [-0.8, 0.6, 0], I('Soğuk uyarı', 'Soğuk reseptörleri uyarır.')); tk.ice = ice;
    tk.flame = add(s, new THREE.ConeGeometry(0.24, 0.7, 14), mat(0xf97316, { emissive: 0xea580c, emissiveIntensity: 0.8 }), [0.8, 0.6, 0], I('Sıcak uyarı', 'Sıcak reseptörlerini uyarır.'));
  }
  { // ağrı
    const s = sta(3, 'Ağrı reseptörü'), A = I('Ağrı reseptörü (serbest sinir ucu)', 'Doku hasarı yapabilecek zararlı uyarıları algılar. Dallanmış serbest sinir uçlarıdır; vücudu korumak için uyarı verir.');
    add(s, new THREE.BoxGeometry(2, 0.5, 1.4), mat(0xfdba74, { roughness: 0.8 }), [0, 0.4, 0], I('Deri', 'Ağrı reseptörlerinin bulunduğu dokudur.'));
    [-0.6, 0, 0.6].forEach(x => tube(s, [[x, 0.2, 0], [x + 0.1, 0.65, 0], [x - 0.05, 1.0, 0]], 0.05, mat(0xf97316), A, 12));
    tk.thorn = add(s, new THREE.ConeGeometry(0.16, 0.9, 12), mat(0x94a3b8, { metalness: 0.7 }), [0.3, 1.8, 0], I('Zararlı uyarı (iğne)', 'Doku hasarı yapan uyarı ağrı reseptörünü uyarır.')); tk.thorn.rotation.z = Math.PI;
    tk.spark = add(s, sph(0.14, 12), mat(0xfde047, { emissive: 0xfacc15, emissiveIntensity: 1 }), [-
