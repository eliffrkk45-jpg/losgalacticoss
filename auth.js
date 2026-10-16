import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  updateProfile, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

let auth = null, ready = false;
try {
  if (!firebaseConfig.apiKey.startsWith("BURAYA")) {
    auth = getAuth(initializeApp(firebaseConfig));
    auth.languageCode = "tr";
    ready = true;
    getRedirectResult(auth).catch(() => {});
  }
} catch (e) { console.warn("Firebase başlatılamadı:", e); }

const need = () => { if (!ready) throw { code: "yapilandirma" }; };

export function watchAuth(cb) { if (!ready) { cb(null); return; } onAuthStateChanged(auth, cb); }

export async function googleLogin() {
  need();
  const p = new GoogleAuthProvider();
  try { await signInWithPopup(auth, p); }
  catch (e) {
    if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(e.code)) await signInWithRedirect(auth, p);
    else throw e;
  }
}
export async function emailLogin(e, p) { need(); await signInWithEmailAndPassword(auth, e, p); }
export async function emailRegister(name, e, p) {
  need();
  const c = await createUserWithEmailAndPassword(auth, e, p);
  if (name) await updateProfile(c.user, { displayName: name });
}
export async function resetPassword(e) { need(); await sendPasswordResetEmail(auth, e); }
export async function logout() { if (ready) await signOut(auth); }

const ERR = {
  "yapilandirma": "Firebase ayarları henüz girilmedi (js/firebase-config.js). Şimdilik misafir olarak devam edebilirsin.",
  "auth/invalid-email": "E-posta adresi geçersiz.",
  "auth/missing-email": "E-posta adresini yaz.",
  "auth/missing-password": "Şifreni yaz.",
  "auth/weak-password": "Şifre en az 6 karakter olmalı.",
  "auth/email-already-in-use": "Bu e-posta zaten kayıtlı. Giriş yapmayı dene.",
  "auth/invalid-credential": "E-posta veya şifre hatalı.",
  "auth/user-not-found": "Bu e-posta ile kayıt bulunamadı.",
  "auth/wrong-password": "Şifre hatalı.",
  "auth/popup-closed-by-user": "Giriş penceresi kapatıldı.",
  "auth/network-request-failed": "İnternet bağlantını kontrol et.",
  "auth/too-many-requests": "Çok fazla deneme yapıldı, biraz bekle.",
  "auth/unauthorized-domain": "Bu site adresi Firebase'de yetkili alan adlarına eklenmemiş."
};
export const trErr = c => ERR[c] || "Bir sorun oluştu. Tekrar dene.";
