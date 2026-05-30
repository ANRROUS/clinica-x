import cron from 'node-cron';
import { prisma } from '@/shared/prisma-client';
import { logger } from '@/shared/logger';

export function registerClearHorariosJob(): void {
  cron.schedule(
    '0 10 * * 6',
    async () => {
      try {
        const result = await prisma.horarioMedico.deleteMany({});
        logger.info(`Cron de limpieza ejecutado: ${result.count} horarios eliminados`);
      } catch (err) {
        logger.error({ err }, 'Error en cron de limpieza de horarios');
      }
    },
    {
      scheduled: true,
      timezone: 'America/Lima',
    },
  );

  logger.info('Cron job de limpieza de horarios registrado (cada sábado 10:00 AM Lima)');
}
