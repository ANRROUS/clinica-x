export function parseApiDate(value: string): Date {
  if (!value) return new Date(NaN);
  if (value.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(value)) {
    return new Date(value);
  }
  return new Date(value + 'Z');
}