import CryptoJS from 'crypto-js'

const SECRET   = import.meta.env.VITE_CRYPTO_SECRET
const APP_NAME = import.meta.env.VITE_APP_NAME
const APP_VER  = import.meta.env.VITE_APP_VER

// ── generateSignature ────────────────────────────────────────
// Encrypts APP_NAME:APP_VER → sent as X-App-Signature header
// Regenerated on every request (new salt each time)
export function generateSignature() {
  return CryptoJS.AES.encrypt(
    `${APP_NAME}:${APP_VER}`,
    SECRET
  ).toString()
}

// ── encrypt ──────────────────────────────────────────────────
// Use for: sensitive request body fields
export function encrypt(value) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET
  ).toString()
}

// ── encryptId ────────────────────────────────────────────────
// Use for: /{id} in URL — URL-safe Base64
export function encryptId(id) {
  return CryptoJS.AES.encrypt(String(id), SECRET)
    .toString()
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// ── decrypt ──────────────────────────────────────────────────
// Use for: decrypting backend encrypted responses (if needed)
export function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
