const { encryptId, decryptId } = require('./crypto')

describe('Crypto Utility', () => {
  it('should encrypt and decrypt a number correctly', () => {
    const originalId = 123
    const encrypted = encryptId(originalId)
    
    expect(encrypted).not.toBe(originalId)
    expect(typeof encrypted).toBe('string')
    
    const decrypted = decryptId(encrypted)
    expect(decrypted).toBe(originalId)
  })

  it('should return NaN for invalid encrypted string', () => {
    const decrypted = decryptId('invalid_random_string')
    expect(decrypted).toBeNaN()
  })
})
