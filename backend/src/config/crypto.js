const CryptoJS = require('crypto-js')

const SECRET = process.env.CRYPTO_SECRET

// ── decrypt ──────────────────────────────────────────────────
// Decrypts CryptoJS.AES.encrypt(value, passphrase) from frontend
// Algorithm : AES-256-CBC
// Key derive : EVP_BytesToKey (MD5) — compatible with CryptoJS
function decrypt(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// ── decryptId ────────────────────────────────────────────────
// Decrypts URL-safe Base64 encrypted ID from frontend
function decryptId(encryptedId) {
  const base64 = encryptedId
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
  return parseInt(decrypt(padded))
}

function encryptId(id) {
  return CryptoJS.AES.encrypt(String(id), SECRET)
    .toString()
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

module.exports = { decrypt, decryptId, encryptId }
