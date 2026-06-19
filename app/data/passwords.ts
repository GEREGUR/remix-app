import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)
const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  let salt = randomBytes(16).toString('base64url')
  let key = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
  return `scrypt$${salt}$${key.toString('base64url')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  let [algorithm, salt, storedKey] = hash.split('$')

  if (algorithm !== 'scrypt' || !salt || !storedKey) {
    return false
  }

  let stored = Buffer.from(storedKey, 'base64url')
  if (stored.length !== KEY_LENGTH) {
    return false
  }

  let actual = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
  return timingSafeEqual(actual, stored)
}
