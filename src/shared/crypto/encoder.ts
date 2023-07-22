export const encodeString = (data: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};

export const decodeBytes = (bytes: ArrayBuffer): string => {
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}
