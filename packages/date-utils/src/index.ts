/**
 * ============================================================================
 * @clinica-x/date-utils — Utilidades de fecha con timezone America/Lima
 * ============================================================================
 *
 * Reglas de oro del monorepo:
 *  1. NUNCA usar `new Date()` directamente. Usar `nowLima()`.
 *  2. NUNCA usar `new Date(string)` directamente. Usar `parseLimaDate()`.
 *  3. NUNCA usar `.getHours()`, `.getDay()`, etc. directamente en Dates
 *     que vienen del backend. Usar `getLimaHours()`, `getLimaDayOfWeek()`, etc.
 *  4. Las fechas se almacenan en PostgreSQL como UTC (timestamp without tz).
 *  5. El intercambio frontend-backend usa ISO 8601 con Z (UTC).
 *  6. Toda la lógica de negocio opera sobre la hora de Lima.
 * ============================================================================
 */

import {
  formatInTimeZone,
  fromZonedTime,
  toZonedTime,
} from 'date-fns-tz';

const LIMA_TZ = 'America/Lima';

// ─────────────────────────────────────────────────────────────────────────────
// Fecha/hora actual en Lima
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene la fecha/hora actual en Lima, representada como Date UTC.
 * Esto es compatible con Prisma y PostgreSQL.
 *
 * Ejemplo: si en Lima son 10:00 AM (UTC-5), retorna un Date que es 15:00 UTC.
 */
export function nowLima(): Date {
  const now = new Date();
  const limaStr = formatInTimeZone(now, LIMA_TZ, "yyyy-MM-dd'T'HH:mm:ss.SSS");
  return fromZonedTime(limaStr, LIMA_TZ);
}

// ─────────────────────────────────────────────────────────────────────────────
// Parseo de fechas (entrada desde APIs, frontend, etc.)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsea un string de fecha interpretándolo como hora de Lima.
 *
 * - Si el string termina en 'Z' o tiene offset (+/-HH:mm), lo interpreta como
 *   UTC y lo devuelve tal cual (Date UTC).
 * - Si NO tiene timezone, asume que es hora de Lima y la convierte a UTC.
 */
export function parseLimaDate(value: string | Date): Date {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  if (value.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(value)) {
    return new Date(value);
  }
  return fromZonedTime(value, LIMA_TZ);
}

/**
 * Alias semántico para parsear fechas que vienen desde la API.
 * Útil para claridad en el frontend.
 */
export function parseApiDate(value: string | Date): Date {
  return parseLimaDate(value);
}

/**
 * Construye una fecha UTC a partir de una fecha (YYYY-MM-DD) y hora (HH:mm:ss)
 * que representan la hora de Lima.
 *
 * Ejemplo: buildLimaDate('2024-05-20', '10:00:00') → Date UTC 15:00:00
 */
export function buildLimaDate(dateStr: string, timeStr = '00:00:00'): Date {
  return fromZonedTime(`${dateStr}T${timeStr}`, LIMA_TZ);
}

// ─────────────────────────────────────────────────────────────────────────────
// Formateo para display (frontend)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formatea un Date UTC mostrando la hora de Lima.
 *
 * Formatos útiles de date-fns:
 *   'dd/MM/yyyy HH:mm'  → 20/05/2024 10:00
 *   'yyyy-MM-dd'         → 2024-05-20
 *   'HH:mm'              → 10:00
 *   'EEEE'               → lunes
 *   'LLLL'               → mayo
 */
export function formatLima(
  date: Date | string | number,
  fmt = 'dd/MM/yyyy HH:mm',
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(d, LIMA_TZ, fmt);
}

/**
 * Formatea como string ISO 8601 con Z desde una fecha que representa Lima.
 * Útil para enviar fechas al backend.
 */
export function toISOLima(date: Date | string): string {
  const d = typeof date === 'string' ? parseLimaDate(date) : date;
  return d.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Componentes de fecha/hora en Lima (para reemplazar .getHours(), .getDay(), etc.)
// ─────────────────────────────────────────────────────────────────────────────

export function getLimaYear(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number(formatInTimeZone(d, LIMA_TZ, 'yyyy'));
}

export function getLimaMonth(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number(formatInTimeZone(d, LIMA_TZ, 'MM')) - 1; // 0-based
}

export function getLimaDay(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number(formatInTimeZone(d, LIMA_TZ, 'dd'));
}

export function getLimaHours(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number(formatInTimeZone(d, LIMA_TZ, 'HH'));
}

export function getLimaMinutes(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number(formatInTimeZone(d, LIMA_TZ, 'mm'));
}

/**
 * Día de la semana en Lima (1 = Lunes, 7 = Domingo).
 * Compatible con el modelo HorarioMedico.diaSemana.
 */
export function getLimaDayOfWeek(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  // 'i' = día de la semana ISO: 1 = Lunes, 7 = Domingo
  return Number(formatInTimeZone(d, LIMA_TZ, 'i'));
}

// ─────────────────────────────────────────────────────────────────────────────
// Inicio/fin de períodos en Lima
// ─────────────────────────────────────────────────────────────────────────────

export function startOfDayLima(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const limaStr = formatInTimeZone(d, LIMA_TZ, 'yyyy-MM-dd');
  return fromZonedTime(`${limaStr}T00:00:00`, LIMA_TZ);
}

export function endOfDayLima(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const limaStr = formatInTimeZone(d, LIMA_TZ, 'yyyy-MM-dd');
  return fromZonedTime(`${limaStr}T23:59:59.999`, LIMA_TZ);
}

export function startOfMonthLima(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const limaStr = formatInTimeZone(d, LIMA_TZ, 'yyyy-MM');
  return fromZonedTime(`${limaStr}-01T00:00:00`, LIMA_TZ);
}

export function endOfMonthLima(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = getLimaYear(d);
  const month = getLimaMonth(d) + 1; // 1-based
  const lastDay = new Date(year, month, 0).getDate();
  const limaStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return fromZonedTime(`${limaStr}T23:59:59.999`, LIMA_TZ);
}

// ─────────────────────────────────────────────────────────────────────────────
// Aritmética de fechas en Lima
// ─────────────────────────────────────────────────────────────────────────────

function addLima(
  date: Date | string,
  unit: 'day' | 'month' | 'year',
  amount: number,
): Date {
  const d = typeof date === 'string' ? parseLimaDate(date) : date;
  const limaStr = formatInTimeZone(d, LIMA_TZ, "yyyy-MM-dd'T'HH:mm:ss");
  const [datePart, timePart] = limaStr.split('T');
  const [y, m, day] = datePart.split('-').map(Number);

  // Usar JS Date nativo para manejar desbordamiento de mes/año correctamente
  // (ej: 32 mayo → 1 junio, no recortado a 31 mayo)
  const jsDate = new Date(y, m - 1, day);
  if (unit === 'day') jsDate.setDate(jsDate.getDate() + amount);
  if (unit === 'month') jsDate.setMonth(jsDate.getMonth() + amount);
  if (unit === 'year') jsDate.setFullYear(jsDate.getFullYear() + amount);
  const newY = jsDate.getFullYear();
  const newM = jsDate.getMonth() + 1;
  const newD = jsDate.getDate();

  const newDateStr = `${newY}-${String(newM).padStart(2, '0')}-${String(newD).padStart(2, '0')}T${timePart}`;
  return fromZonedTime(newDateStr, LIMA_TZ);
}

export function addDaysLima(date: Date | string, amount: number): Date {
  return addLima(date, 'day', amount);
}

export function addMonthsLima(date: Date | string, amount: number): Date {
  return addLima(date, 'month', amount);
}

export function addYearsLima(date: Date | string, amount: number): Date {
  return addLima(date, 'year', amount);
}

// ─────────────────────────────────────────────────────────────────────────────
// Comparaciones en Lima
// ─────────────────────────────────────────────────────────────────────────────

export function isBeforeLima(a: Date | string, b: Date | string): boolean {
  const da = typeof a === 'string' ? parseLimaDate(a) : a;
  const db = typeof b === 'string' ? parseLimaDate(b) : b;
  return da.getTime() < db.getTime();
}

export function isAfterLima(a: Date | string, b: Date | string): boolean {
  const da = typeof a === 'string' ? parseLimaDate(a) : a;
  const db = typeof b === 'string' ? parseLimaDate(b) : b;
  return da.getTime() > db.getTime();
}

export function isSameDayLima(a: Date | string, b: Date | string): boolean {
  const da = typeof a === 'string' ? parseLimaDate(a) : a;
  const db = typeof b === 'string' ? parseLimaDate(b) : b;
  return (
    getLimaYear(da) === getLimaYear(db) &&
    getLimaMonth(da) === getLimaMonth(db) &&
    getLimaDay(da) === getLimaDay(db)
  );
}

export function diffInMsLima(a: Date | string, b: Date | string): number {
  const da = typeof a === 'string' ? parseLimaDate(a) : a;
  const db = typeof b === 'string' ? parseLimaDate(b) : b;
  return da.getTime() - db.getTime();
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades específicas del proyecto
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formatea una fecha extendida al estilo del proyecto:
 * "Lunes, 20 de Mayo de 2024"
 */
export function formatDateExtended(date: Date | string): string {
  const dayNames = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
  ];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const d = typeof date === 'string' ? parseLimaDate(date) : date;
  const dayName = dayNames[getLimaDayOfWeek(d) % 7];
  const monthName = monthNames[getLimaMonth(d)];
  return `${dayName}, ${getLimaDay(d)} de ${monthName} de ${getLimaYear(d)}`;
}

/**
 * Obtiene el string 'YYYY-MM-DD' de la fecha actual en Lima.
 * Útil para inputs type="date".
 */
export function todayLimaString(): string {
  return formatInTimeZone(new Date(), LIMA_TZ, 'yyyy-MM-dd');
}

/**
 * Obtiene el string 'YYYY-MM-DD' de una fecha en Lima.
 */
export function toDateStringLima(date: Date | string): string {
  const d = typeof date === 'string' ? parseLimaDate(date) : date;
  return formatInTimeZone(d, LIMA_TZ, 'yyyy-MM-dd');
}

/**
 * Comprueba si una fecha/hora en Lima está en el futuro respecto a "ahora" en Lima.
 */
export function isFutureLima(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseLimaDate(date) : date;
  return d.getTime() > nowLima().getTime();
}

/**
 * Comprueba si una fecha/hora en Lima está en el pasado respecto a "ahora" en Lima.
 */
export function isPastLima(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseLimaDate(date) : date;
  return d.getTime() < nowLima().getTime();
}
