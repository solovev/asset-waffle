import { Cipher } from "./cipher";

describe("Cipher", () => {
  const SALT = "YXNkYXNkMTIzMTIzMTIzY2N4dmNkZw==";
  const DATA = 'Some "Hello World" message to encrypt';

  it("Should create key and encrypt/decrypt", async () => {
    const cipher = new Cipher(SALT);

    const key = await cipher.generateKey();
    const { encrypted, iv } = await cipher.encrypt(DATA, key);

    const decryptedData = await cipher.decrypt(encrypted, key, iv);

    expect(decryptedData).toBe(DATA);
  });
});
