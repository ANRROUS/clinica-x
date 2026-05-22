import crypto from 'crypto';
import { Result, Ok, Err, ValueObjectBase } from '@clinica-x/shared-kernel';

const TOKEN_BYTES = 32;
const EXPIRACION_HORAS = 1;

export class ResetToken extends ValueObjectBase<string> {
  public readonly expiraEn: Date;

  private constructor(valor: string, expiraEn: Date) {
    super(valor);
    this.expiraEn = expiraEn;
  }

  static create(token?: string): Result<ResetToken, Error> {
    if (token) {
      return Ok(new ResetToken(token, new Date(0)));
    }
    const valor = crypto.randomBytes(TOKEN_BYTES).toString('hex');
    const expiraEn = new Date(Date.now() + EXPIRACION_HORAS * 60 * 60 * 1000);
    return Ok(new ResetToken(valor, expiraEn));
  }

  estaExpirado(): boolean {
    return Date.now() > this.expiraEn.getTime();
  }
}
