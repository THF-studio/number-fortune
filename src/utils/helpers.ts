export function replaceZeros(digits: number[]): number[] {
  return digits.map((d) => (d === 0 ? 8 : d))
}

export function parseDigits(phone: string): number[] {
  return phone.replace(/\D/g, '').split('').map(Number)
}
