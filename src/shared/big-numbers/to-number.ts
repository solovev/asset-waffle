export function convertToNumber(decimals: bigint, value: bigint) {
  const mantissa = Math.pow(10, Number(decimals));
  return Number(value) / mantissa;
}
