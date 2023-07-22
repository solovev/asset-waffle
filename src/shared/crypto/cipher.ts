import { decodeBytes, encodeString } from "./encoder";

export class Cipher {
  private salt: ArrayBuffer;

  constructor() {
    this.salt = this.unpack(import.meta.env.VITE_SALT);
  }

  encrypt = async (data: string, key: CryptoKey) => {
    const encoded = encodeString(data);
    const iv = this.generateIv();
    const params = { name: "AES-GCM", iv };
    const cipher = await crypto.subtle.encrypt(params, key, encoded);
    return { cipher: this.pack(cipher), iv: this.pack(iv) };
  };

  decrypt = async (cipher: string, key: CryptoKey, iv: string) => {
    const params = { name: "AES-GCM", iv: this.unpack(iv) };
    const encoded = await crypto.subtle.decrypt(
      params,
      key,
      this.unpack(cipher)
    );
    return decodeBytes(encoded);
  };

  generateKey = async (): Promise<CryptoKey> => {
    const params = { name: "AES-GCM", length: 256 };
    return await crypto.subtle.generateKey(params, true, [
      "encrypt",
      "decrypt",
    ]);
  };

  wrapKey = async (
    keyToWrap: CryptoKey,
    password: string
  ): Promise<ArrayBuffer> => {
    const keyMaterial = await this.getKeyMaterial(password);
    const wrappingKey = await this.getKey(keyMaterial);

    return window.crypto.subtle.wrapKey(
      "raw",
      keyToWrap,
      wrappingKey,
      "AES-KW"
    );
  };

  unwrapKey = async (wrappedKey: ArrayBuffer, password: string) => {
    const unwrappingKey = await this.getUnwrappingKey(password);
    return window.crypto.subtle.unwrapKey(
      "raw",
      wrappedKey,
      unwrappingKey,
      "AES-KW",
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );
  };

  private getUnwrappingKey = async (password: string) => {
    const keyMaterial = await this.getKeyMaterial(password);
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: this.salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-KW", length: 256 },
      true,
      ["wrapKey", "unwrapKey"]
    );
  };

  private getKeyMaterial = (password: string): Promise<CryptoKey> => {
    return crypto.subtle.importKey(
      "raw",
      encodeString(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  };

  private getKey = (keyMaterial: CryptoKey) => {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: this.salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-KW", length: 256 },
      true,
      ["wrapKey", "unwrapKey"]
    );
  };

  private pack = (buffer: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  private unpack = (packed: string): ArrayBuffer => {
    const string = window.atob(packed);
    const buffer = new ArrayBuffer(string.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < string.length; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  };

  private generateIv = (): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(12));
  };
}
