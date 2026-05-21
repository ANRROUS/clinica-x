import { parseLimaDate } from '@clinica-x/date-utils';

export function parseApiDate(value: string): Date {
  if (!value) return new Date(NaN);
  return parseLimaDate(value);
}
