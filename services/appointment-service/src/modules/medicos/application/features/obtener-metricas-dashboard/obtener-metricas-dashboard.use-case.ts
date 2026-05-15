/**
 * ============================================================================
 * Caso de uso: ObtenerMetricasDashboard
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type { IObtenerMetricasDashboardPort, MetricasDashboardDto } from '@/modules/medicos/domain/ports/in/medicos.port';
import { prisma } from '@/shared/prisma-client';

export class ObtenerMetricasDashboardUseCase implements IObtenerMetricasDashboardPort {
  async execute(): Promise<Result<MetricasDashboardDto, Error>> {
    const [totalDoctors, activeDoctors, inactiveDoctors, totalSpecialties] = await Promise.all([
      prisma.medico.count(),
      prisma.medico.count({ where: { activo: true } }),
      prisma.medico.count({ where: { activo: false } }),
      prisma.especialidad.count({
        where: {
          medicos: {
            some: { activo: true },
          },
        },
      }),
    ]);

    return Ok({
      totalDoctors,
      activeDoctors,
      inactiveDoctors,
      totalSpecialties,
    });
  }
}
