import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Viewer {
  constructor(box) {
    this.box = box; this.onPick = () => {}; this.group = null; this.api = null;
    this.exp = 0; this.expTarget = 0; this.homes = []; this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    box.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.HemisphereLight(0xcff6ff, 0x0b3a4a, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(4, 7, 6); this.scene.add(sun);
    const p1 = new THREE.PointLight(0x22d3ee, 120, 40, 2); p1.position.set(-8, 3, 5); this.scene.add(p1);
    const p2 = new THREE.PointLight(0x34d399, 120, 40, 2); p2.position.set(8, -3, 5); this.scene.add(p2);

    const pos = [];
    for (let i = 0; i < 160; i++) {
      const r = 14 + Math.random() * 18, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
      pos.push(r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a));
    }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.14, transparent: true, opacity: 0.7 }));
    this.scene.add(this.stars);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true; this.controls.zoomSpeed = 1.1;
    this.controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    this.controls.autoRotateSpeed = 1.2;

    this.ray = new THREE.Raycaster(); this.ndc = new THREE.Vector2();
    const el = this.renderer.domElement; let down = null;
    el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    el.addEventListener('pointerup', e => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved < 8 && performance.now() - down.t < 500) this.pick(e);
      down = null;
    });
    el.addEventListener('dblclick', () => this.fit());

    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(box);
    this.renderer.setAnimationLoop(() => this.loop());
  }

  resize() {
    const w = this.box.clientWidth, h = this.box.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }

  show(built) {
    if (this.group) { this.scene.remove(this.group); this.free(this.group); }
    this.group = built.group; this.api = built.api || {}; this.scene.add(this.group);
    this.homes = [];
    this.group.children.forEach(c => { if (c.userData.out) { c.userData.home = c.position.clone(); this.homes.push(c); } });
    this.exp = 0; this.expTarget = 0;
    const parts = new Set(); this.group.traverse(o => { if (o.userData && o.userData.info) parts.add(o.userData.info.t); });
    this.resize(); this.fit();
    return [...parts];
  }

  fit() {
    if (!this.group) return;
    const box = new THREE.Box3().setFromObject(this.group), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const fov = THREE.MathUtils.degToRad(this.camera.fov), a = this.camera.aspect || 1;
    const dH = (size.y / 2) / Math.tan(fov / 2), dW = (size.x / 2) / (Math.tan(fov / 2) * a);
    const d = Math.max(dH, dW) * 1.25 + size.z / 2;
    const dir = (this.group.userData.view || new THREE.Vector3(0, 0.18, 1)).clone().normalize();
    this.controls.target.copy(c); this.camera.position.copy(c).addScaledVector(dir, d);
    this.controls.minDistance = d * 0.25; this.controls.maxDistance = d * 2.2; this.controls.update();
  }

  setAuto(b) { this.controls.autoRotate = b; }
  toggleExplode() { this.expTarget = this.expTarget ? 0 : 1; return !!this.expTarget; }

  pick(e) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    if (!this.group) return;
    const hits = this.ray.intersectObject(this.group, true), list = [];
    for (const h of hits) {
      let o = h.object;
      while (o && !(o.userData && o.userData.info)) o = o.parent;
      if (o) list.push({ o, h });
    }
    let chosen = null;
    const solid = list.find(x => !x.o.userData.shell);
    if (solid) chosen = solid.o;
    else {
      const sh = list.filter(x => x.o.userData.shell);
      if (sh.length === 1) chosen = sh[0].o;
      else if (sh.length > 1) {
        const f = sh[0]; let graze = false;
        if (f.h.face) { const n = f.h.face.normal.clone().transformDirection(f.h.object.matrixWorld); graze = Math.abs(n.dot(this.ray.ray.direction)) < 0.45; }
        chosen = graze ? sh[0].o : sh[sh.length - 1].o;
      }
    }
    if (!chosen) return;
    this.flash(chosen); this.onPick(chosen);
  }

  flash(o) {
    this._restore && this._restore(); clearTimeout(this._ft);
    const mats = new Set(); o.traverse(m => { if (m.material && m.material.emissive) mats.add(m.material); });
    const saved = [...mats].map(m => [m, m.emissive.getHex(), m.emissiveIntensity]);
    mats.forEach(m => { m.emissive.setHex(0x22ffd0); m.emissiveIntensity = 0.7; });
    const sc = o.scale.clone(); if (!o.userData.shell) o.scale.multiplyScalar(1.12);
    this._restore = () => { saved.forEach(([m, h, i]) => { m.emissive.setHex(h); m.emissiveIntensity = i; }); o.scale.copy(sc); this._restore = null; };
    this._ft = setTimeout(() => this._restore && this._restore(), 900);
  }

  loop() {
    const dt = Math.min(this.clock.getDelta(), 0.05), t = this.clock.elapsedTime;
    if (this.group) {
      this.api && this.api.tick && this.api.tick(t, dt);
      this.exp += (this.expTarget - this.exp) * (1 - Math.exp(-dt * 4));
      for (const c of this.homes) c.position.copy(c.userData.home).addScaledVector(c.userData.out, this.exp);
    }
    this.stars.rotation.y += dt * 0.02;
    this.controls.update(); this.renderer.render(this.scene, this.camera);
  }

  free(g) { g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.map && m.map.dispose(); m.dispose(); }); } }); }

  dispose() {
    this.renderer.setAnimationLoop(null); this.ro.disconnect(); this.controls.dispose();
    if (this.group) this.free(this.group);
    this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer.domElement.remove();
  }
}
