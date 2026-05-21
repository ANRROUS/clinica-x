import { ErrorDominio } from '@clinica-x/shared-kernel';

export class UsuarioDuplicadoError extends ErrorDominio {
  readonly codigo = 'USUARIO_DUPLICADO';
  readonly httpStatus = 409;

  constructor(campo: string, valor: string) {
    super(`Ya existe un usuario con ${campo}='${valor}'`);
  }
}

export class CredencialesInvalidasError extends ErrorDominio {
  readonly codigo = 'CREDENCIALES_INVALIDAS';
  readonly httpStatus = 401;

  constructor() {
    super('DNI, correo o contraseña incorrectos');
  }
}

export class UsuarioNoEncontradoError extends ErrorDominio {
  readonly codigo = 'USUARIO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id?: string) {
    super(id ? `Usuario con id '${id}' no encontrado` : 'Usuario no encontrado');
  }
}

export class TokenInvalidoError extends ErrorDominio {
  readonly codigo = 'TOKEN_INVALIDO';
  readonly httpStatus = 400;

  constructor() {
    super('El enlace de recuperación no es válido');
  }
}

export class TokenExpiradoError extends ErrorDominio {
  readonly codigo = 'TOKEN_EXPIRADO';
  readonly httpStatus = 400;

  constructor() {
    super('El enlace de recuperación ha expirado');
  }
}
