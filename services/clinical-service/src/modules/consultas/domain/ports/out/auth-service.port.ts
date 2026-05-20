/**
 * ============================================================================
 * Port de salida — Auth Service Client
 * ============================================================================
 * Contrato para comunicación cross-service con auth-service.
 * ============================================================================
 */

export interface IAuthServiceClient {
  obtenerUsuariosPorIds(ids: string[]): Promise<Array<{
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
  }>>;
}
