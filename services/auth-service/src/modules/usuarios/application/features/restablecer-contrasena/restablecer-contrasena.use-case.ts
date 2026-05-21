import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import type { IRestablecerContrasenaPort } from '../../../domain/ports/in/usuarios.port';
import type { IUsuarioRepository, IHashService } from '../../../domain/ports/out/usuario.repository.port';
import { TokenInvalidoError } from '../../../domain/exceptions/usuario.errors';

export class RestablecerContrasenaUseCase implements IRestablecerContrasenaPort {
  constructor(
    private readonly repo: IUsuarioRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(token: string, nuevaContrasena: string): Promise<Result<{ message: string }, Error>> {
    const usuario = await this.repo.buscarPorResetToken(token);
    if (!usuario) {
      return Err(new TokenInvalidoError());
    }

    const nuevoHash = await this.hashService.hash(nuevaContrasena);
    await this.repo.actualizarContrasenaYLimpiarToken(usuario.id, nuevoHash);

    return Ok({ message: 'Contraseña actualizada correctamente' });
  }
}
