const ENCRYPTION_KEY = 'my_psw_plus_secret_key_123';

/**
 * Encrypts any JS object/value into an obfuscated hex string.
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    let result = '';
    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      // XOR the charCode with keyChar and convert to a 4-digit hex string
      const encryptedChar = (charCode ^ keyChar).toString(16).padStart(4, '0');
      result += encryptedChar;
    }
    return result;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypts an obfuscated hex string back into its original JS object/value.
 */
export const decryptData = (encryptedString: string | null): any => {
  if (!encryptedString) return null;
  try {
    let decryptedString = '';
    for (let i = 0; i < encryptedString.length; i += 4) {
      const hexChar = encryptedString.substring(i, i + 4);
      const charCode = parseInt(hexChar, 16);
      const keyChar = ENCRYPTION_KEY.charCodeAt((i / 4) % ENCRYPTION_KEY.length);
      decryptedString += String.fromCharCode(charCode ^ keyChar);
    }
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
