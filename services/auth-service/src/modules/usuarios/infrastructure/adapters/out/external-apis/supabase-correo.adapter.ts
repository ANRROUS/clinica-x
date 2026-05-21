import { env } from '@/env';
import { logger } from '@/shared/logger';
import type { IServicioCorreo, ICrearCorreoRecuperacion } from '@/modules/usuarios/domain/ports/out/correo.repository.port';

export class SupabaseEdgeFunctionCorreoAdapter implements IServicioCorreo {
  async enviarCorreoRecuperacion(dto: ICrearCorreoRecuperacion): Promise<void> {
    const url = `${env.SUPABASE_EDGE_FUNCTION_URL}/send-reset-email`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'x-internal-secret': env.INTERNAL_EMAIL_SECRET,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const body = await response.text();
        logger.error({ status: response.status, body }, 'Error al enviar correo de recuperación via Edge Function');
        return;
      }

      logger.info({ email: dto.email }, 'Correo de recuperación enviado exitosamente');
    } catch (err) {
      logger.error({ err }, 'Error de conexión con Edge Function de Supabase');
    }
  }
}
