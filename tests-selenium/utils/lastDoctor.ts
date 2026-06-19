import * as fs from 'fs';
import * as path from 'path';

export interface DoctorCredentials {
  email: string;
  password: string;
}

const TMP_PATH = path.resolve(__dirname, '../tmp/last-doctor.json');

export function saveLastDoctor(creds: DoctorCredentials): void {
  const dir = path.dirname(TMP_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TMP_PATH, JSON.stringify(creds, null, 2), 'utf-8');
}

export function getLastDoctor(): DoctorCredentials {
  if (!fs.existsSync(TMP_PATH)) {
    throw new Error(
      'No se encontró tests-selenium/tmp/last-doctor.json. ' +
      'Ejecutar A-03 (3.3-agregar-doctor) primero para registrar el médico de prueba.',
    );
  }
  return JSON.parse(fs.readFileSync(TMP_PATH, 'utf-8')) as DoctorCredentials;
}
