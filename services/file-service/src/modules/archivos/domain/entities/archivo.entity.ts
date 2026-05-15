/**
 * ============================================================================
 * Entidad Archivo — Aggregate Root del módulo de archivos
 * ============================================================================
 */

import { EntidadBase, Result, Ok, Err } from '@clinica-x/shared-kernel';

export interface ArchivoProps {
  propietarioServicio: string;
  propietarioRecursoId: string;
  bucket: string;
  keyS3: string;
  nombreOriginal: string;
  mimeType: string;
  tamanoBytes: number;
}

export class Archivo extends EntidadBase<string> {
  private _propietarioServicio: string;
  private _propietarioRecursoId: string;
  private _bucket: string;
  private _keyS3: string;
  private _nombreOriginal: string;
  private _mimeType: string;
  private _tamanoBytes: number;

  private constructor(id: string, props: ArchivoProps) {
    super(id);
    this._propietarioServicio = props.propietarioServicio;
    this._propietarioRecursoId = props.propietarioRecursoId;
    this._bucket = props.bucket;
    this._keyS3 = props.keyS3;
    this._nombreOriginal = props.nombreOriginal;
    this._mimeType = props.mimeType;
    this._tamanoBytes = props.tamanoBytes;
  }

  static create(id: string, props: ArchivoProps): Result<Archivo, Error> {
    if (!props.propietarioServicio || props.propietarioServicio.trim().length === 0) {
      return Err(new Error('El propietarioServicio es requerido'));
    }
    if (!props.propietarioRecursoId || props.propietarioRecursoId.trim().length === 0) {
      return Err(new Error('El propietarioRecursoId es requerido'));
    }
    if (!props.bucket || props.bucket.trim().length === 0) {
      return Err(new Error('El bucket es requerido'));
    }
    if (!props.keyS3 || props.keyS3.trim().length === 0) {
      return Err(new Error('El keyS3 es requerido'));
    }
    if (!props.nombreOriginal || props.nombreOriginal.trim().length === 0) {
      return Err(new Error('El nombreOriginal es requerido'));
    }
    if (!props.mimeType || props.mimeType.trim().length === 0) {
      return Err(new Error('El mimeType es requerido'));
    }
    if (props.tamanoBytes <= 0) {
      return Err(new Error('El tamanoBytes debe ser mayor a 0'));
    }
    return Ok(new Archivo(id, props));
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  get propietarioServicio(): string { return this._propietarioServicio; }
  get propietarioRecursoId(): string { return this._propietarioRecursoId; }
  get bucket(): string { return this._bucket; }
  get keyS3(): string { return this._keyS3; }
  get nombreOriginal(): string { return this._nombreOriginal; }
  get mimeType(): string { return this._mimeType; }
  get tamanoBytes(): number { return this._tamanoBytes; }
}
