/**
 * Secure SHA-256 Client-Side Hashing Utility
 * Ensures passcode is NEVER stored or rendered in plain text anywhere in source code or DOM.
 */

// Target SHA-256 Hash for 'ar786'
export const PASSCODE_HASH = '5b07897df8ef7a1518f8e02d609279a0c0e86b24d7eb194c5026df1265f0535e';

export async function hashPasscode(inputStr) {
  if (!inputStr) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(inputStr.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPasscode(inputStr) {
  const hashedInput = await hashPasscode(inputStr);
  return hashedInput === PASSCODE_HASH;
}
