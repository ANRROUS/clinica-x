/**
 * Mapea los códigos internos de análisis a nombres legibles.
 */
export function getAnalisisDisplayName(examName: string): string {
  switch (examName) {
    case 'SANGRE':
      return 'Análisis de Sangre';
    case 'ORINA':
      return 'Análisis de Orina';
    case 'HECES':
      return 'Análisis de Heces';
    default:
      return examName;
  }
}
