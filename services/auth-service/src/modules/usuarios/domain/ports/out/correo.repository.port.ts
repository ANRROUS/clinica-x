export interface ICrearCorreoRecuperacion {
  email: string;
  nombre: string;
  token: string;
}

export interface IServicioCorreo {
  enviarCorreoRecuperacion(dto: ICrearCorreoRecuperacion): Promise<void>;
}
