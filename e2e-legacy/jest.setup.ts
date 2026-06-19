import { generarReportes } from './utils/reporter';
import * as path from 'path';

afterEach(() => {
  const page = (globalThis as any).__currentUsabilityPage__;
  if (page && typeof page.finalizeReport === 'function') {
    page.finalizeReport('FAILED', 'Test falló antes de completar el flujo o no se llamó finalizeReport explícitamente');
  }
});
