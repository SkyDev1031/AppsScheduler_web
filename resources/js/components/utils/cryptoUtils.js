import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key-123'; // Replace with a strong secret key

// Function to encrypt data and make it URL-safe
export const encryptParam = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return encodeURIComponent(ciphertext); // Encode for URL safety
};

// Function to decrypt data
export const decryptParam = (encryptedData) => {
  try {
    const decodedData = decodeURIComponent(encryptedData); // Decode the URL-safe string
    const bytes = CryptoJS.AES.decrypt(decodedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null; // Handle decryption errors gracefully
  }
};