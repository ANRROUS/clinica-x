/**
 * ============================================================================
 * maskSensitive — Enmascara datos sensibles en logs
 * ============================================================================
 *
 * Previene la exposición de información sensible en los logs:
 *   - Emails: muestra primer y último carácter del local part
 *   - Teléfonos: muestra primeros 3 y últimos 2 dígitos
 *   - Tokens: muestra primeros 4 y últimos 4 caracteres
 *   - Contraseñas: reemplaza completamente con ***
 *
 * USO:
 *   const masked = maskSensitiveData({ email: 'user@example.com', password: '1234' });
 *   // { email: 'u***r@example.com', password: '***' }
 * ============================================================================
 */

export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone || typeof phone !== 'string' || phone.length < 4) return '***';
  return `${phone.slice(0, 3)}***${phone.slice(-2)}`;
}

export function maskToken(token: string): string {
  if (!token || typeof token !== 'string' || token.length < 8) return '***';
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

export function maskDni(dni: string): string {
  if (!dni || typeof dni !== 'string' || dni.length < 4) return '***';
  return `${dni.slice(0, 2)}***${dni.slice(-1)}`;
}

const SENSITIVE_FIELDS = new Set([
  'email',
  'correo',
  'telefono',
  'phone',
  'celular',
  'token',
  'accessToken',
  'refreshToken',
  'password',
  'passwordHash',
  'contrasena',
  'newPassword',
  'nuevaContrasena',
  'oldPassword',
  'currentPassword',
]);

const MASK_STRATEGIES: Record<string, (value: string) => string> = {
  email: maskEmail,
  correo: maskEmail,
  telefono: maskPhone,
  phone: maskPhone,
  celular: maskPhone,
  token: maskToken,
  accessToken: maskToken,
  refreshToken: maskToken,
  dni: maskDni,
};

export function maskSensitiveData<T extends Record<string, any>>(data: T): T {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;

  const masked = { ...data } as any;

  for (const key of Object.keys(masked)) {
    const value = masked[key];
    if (value === null || value === undefined) continue;

    if (typeof value === 'string') {
      const lowerKey = key.toLowerCase();
      if (MASK_STRATEGIES[lowerKey]) {
        masked[key] = MASK_STRATEGIES[lowerKey](value);
      } else if (SENSITIVE_FIELDS.has(lowerKey)) {
        masked[key] = '***';
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      masked[key] = maskSensitiveData(value);
    }
  }

  return masked;
}
