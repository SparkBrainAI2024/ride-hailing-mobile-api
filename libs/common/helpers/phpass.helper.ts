import * as crypto from 'crypto';

const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
/**
 * Extracts the iteration count from the hash settings.
 */
function getIterationCount(setting: string): number {
  const countLog2 = itoa64.indexOf(setting[3]);
  return 1 << countLog2;
}

/**
 * Custom base64-like encoding used in phpass.
 */
function encode64(input: Buffer, count: number): string {
  let output = '';
  let i = 0;

  while (i < count) {
    let value = input[i++];
    output += itoa64[value & 0x3f];
    if (i < count) {
      value |= input[i] << 8;
    }
    output += itoa64[(value >> 6) & 0x3f];
    if (i++ >= count) break;
    if (i < count) {
      value |= input[i] << 16;
    }
    output += itoa64[(value >> 12) & 0x3f];
    if (i++ >= count) break;
    output += itoa64[(value >> 18) & 0x3f];
  }

  return output;
}

/**
 * Hashes the password using the phpass settings.
 */
function cryptPrivate(password: string, setting: string): string {
  const output = setting.substring(0, 12);
  const count = getIterationCount(setting);
  const salt = setting.substring(4, 12);

  let hash = crypto
    .createHash('md5')
    .update(salt + password)
    .digest();

  for (let i = 0; i < count; i++) {
    hash = crypto
      .createHash('md5')
      .update(Buffer.concat([hash, Buffer.from(password)]))
      .digest();
  }

  return output + encode64(hash, 16);
}

/**
 * Compares password against stored $P$ hash.
 */
export function verifyPhpass(password: string, storedHash: string): boolean {
  if (storedHash.length !== 34) {
    return false;
  }

  const hash = cryptPrivate(password, storedHash);
  return hash === storedHash;
}
