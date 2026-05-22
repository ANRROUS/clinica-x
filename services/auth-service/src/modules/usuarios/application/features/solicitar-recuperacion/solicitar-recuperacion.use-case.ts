import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import type { ISolicitarRecuperacionPort } from '../../../domain/ports/in/usuarios.port';
import type { IUsuarioRepository } from '../../../domain/ports/out/usuario.repository.port';
import type { IServicioCorreo } from '../../../domain/ports/out/correo.repository.port';
import { ResetToken } from '../../../domain/value-objects/reset-token.vo';

export class SolicitarRecuperacionUseCase implements ISolicitarRecuperacionPort {
  constructor(
    private readonly repo: IUsuarioRepository,
    private readonly servicioCorreo: IServicioCorreo,
    private readonly frontendUrl: string,
  ) {}

  async execute(email: string): Promise<Result<{ message: string }, Error>> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuario = await this.repo.buscarPorEmail(emailNormalizado);

    if (!usuario) {
      return Ok({ message: 'Si el correo está registrado, recibirás un enlace de recuperación' });
    }

    const tokenResult = ResetToken.create();
    if (tokenResult.isErr) {
      return Err(tokenResult.error);
    }

    const token = tokenResult.value;
    await this.repo.guardarResetToken(usuario.id, token.value, token.expiraEn);

    const resetLink = `${this.frontendUrl}/reset-password?token=${token.value}`;

    await this.servicioCorreo.enviarCorreoRecuperacion({
      email: usuario.email.value,
      nombre: usuario.nombre,
      token: resetLink,
    });

    return Ok({ message: 'Si el correo está registrado, recibirás un enlace de recuperación' });
  }
}
