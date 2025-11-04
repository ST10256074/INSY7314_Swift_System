import { scrypt, randomFill, createCipheriv, createDecipheriv } from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-192-cbc';
const PASSWORD = process.env.ENCRYPTION_KEY;
const SALT = 'salt';
const KEY_LENGTH = 24; // 24 bytes for AES-192
const IV_LENGTH = 16; // For AES, this is always 16

// Helper function to derive key using scrypt
function deriveKey() {
    return new Promise((resolve, reject) => {
        scrypt(PASSWORD, SALT, KEY_LENGTH, (err, key) => {
            if (err) reject(err);
            else resolve(key);
        });
    });
}

// Encryption function
export async function encrypt(text) {
    // Handle null, undefined, or non-string values
    if (!text || typeof text !== 'string') {
        return text;
    }
    
    try {
        const key = await deriveKey();
        
        return new Promise((resolve, reject) => {
            randomFill(new Uint8Array(IV_LENGTH), (err, iv) => {
                if (err) {
                    reject(new Error('IV generation failed'));
                    return;
                }

                try {
                    const cipher = createCipheriv(ALGORITHM, key, iv);
                    let encrypted = cipher.update(text, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    
                    // Return IV + encrypted data
                    resolve(Buffer.from(iv).toString('hex') + ':' + encrypted);
                } catch (error) {
                    reject(new Error('Encryption failed: ' + error.message));
                }
            });
        });
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
}

// Decryption function
export async function decrypt(encryptedText) {
    // Handle null, undefined, or non-string values
    if (!encryptedText || typeof encryptedText !== 'string') {
        return encryptedText;
    }
    
    // Check if the encrypted text has the expected format (IV:encryptedData)
    if (!encryptedText.includes(':')) {
        return encryptedText;
    }
    
    try {
        const key = await deriveKey();
        const textParts = encryptedText.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedData = textParts.join(':');
        
        const decipher = createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
}
