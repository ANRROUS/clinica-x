import type { TipoAnalisis } from '@clinica-x/shared-types';

interface OcrSpaceWord {
  WordText: string;
  Left: number;
  Top: number;
  Height: number;
  Width: number;
}

interface OcrSpaceLine {
  LineText: string;
  Words: OcrSpaceWord[];
  MaxHeight: number;
  MinTop: number;
}

interface OcrSpaceParsedResult {
  TextOverlay?: {
    Lines: OcrSpaceLine[];
    HasOverlay: boolean;
    Message: string;
  };
  FileParseExitCode: number;
  TextOrientation: string;
  ParsedText: string;
  ErrorMessage: string;
  ErrorDetails: string;
}

interface OcrSpaceResponse {
  ParsedResults: OcrSpaceParsedResult[];
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ProcessingTimeInMilliseconds: string;
  ErrorMessage?: string;
  ErrorDetails?: string;
}

interface HeaderData {
  laboratorio?: string;
  medicoSolicitante?: string;
  resultadoIdOriginal?: string;
  pacienteNombreOcr?: string;
  pacienteIdOcr?: string;
  pacienteSexo?: string;
  pacienteEdad?: number;
  pacienteFechaNacimiento?: string;
  fechaToma?: string;
  horaToma?: string;
  fechaResultado?: string;
  fechaRegistro?: string;
  datosMuestra: Record<string, unknown>;
}

interface ParsedGroup {
  nombreGrupo: string;
  orden: number;
  items: ParsedItem[];
}

interface ParsedItem {
  nombre: string;
  valor: string;
  unidad?: string;
  rangoMin?: string;
  rangoMax?: string;
  rangoReferencia?: string;
  estado?: string;
  nota?: string;
  orden: number;
}

interface ColumnDef {
  name: string;
  left: number;
  width: number;
}

export class OcrParser {
  private static readonly COLUMN_TOLERANCE = 15;

  parse(rawJson: string, tipoAnalisis: TipoAnalisis): { header: HeaderData; grupos: ParsedGroup[] } {
    const response: OcrSpaceResponse = JSON.parse(rawJson);
    const firstPage = response.ParsedResults[0];
    if (!firstPage) {
      throw new Error('No OCR data found in response');
    }

    const overlay = firstPage.TextOverlay;
    const allLines = overlay?.Lines ?? this.parseFromParsedText(firstPage.ParsedText);
    
    if (!overlay?.Lines) {
      console.warn('[OcrParser] TextOverlay no disponible, usando ParsedText como fallback');
    }

    const header = this.parseHeader(allLines, tipoAnalisis);
    const grupos = this.parseGroups(allLines, tipoAnalisis);

    return { header, grupos };
  }

  private parseHeader(lines: OcrSpaceLine[], tipo: TipoAnalisis): HeaderData {
    const header: HeaderData = { datosMuestra: {} };

    for (const line of lines) {
      const text = line.LineText;

      const labMatch = text.match(/^laboratorio:\s*(.+)$/i);
      if (labMatch) { header.laboratorio = labMatch[1].trim(); continue; }

      const medMatch = text.match(/^medico\s+solicitante:\s*(.+)$/i);
      if (medMatch) { header.medicoSolicitante = medMatch[1].trim(); continue; }

      const resIdMatch = text.match(/^resultado\s+id:\s*(.+)$/i);
      if (resIdMatch) { header.resultadoIdOriginal = resIdMatch[1].trim(); continue; }

      const nombreMatch = text.match(/^nombre:\s*(.+)$/i);
      if (nombreMatch) { header.pacienteNombreOcr = nombreMatch[1].trim(); continue; }

      const idMatch = text.match(/^id:\s*(.+)$/i);
      if (idMatch) { header.pacienteIdOcr = idMatch[1].trim(); continue; }

      const sexoMatch = text.match(/^sexo:\s*(.+)$/i);
      if (sexoMatch) { header.pacienteSexo = sexoMatch[1].trim(); continue; }

      const edadMatch = text.match(/^edad:\s*(.+)$/i);
      if (edadMatch) { header.pacienteEdad = parseInt(edadMatch[1].trim(), 10); continue; }

      const fnacMatch = text.match(/^fecha_nacimiento:\s*(.+)$/i);
      if (fnacMatch) { header.pacienteFechaNacimiento = fnacMatch[1].trim(); continue; }

      const ftomaMatch = text.match(/^fecha_toma:\s*(.+)$/i);
      if (ftomaMatch) { header.fechaToma = ftomaMatch[1].trim(); continue; }

      const horaMatch = text.match(/^hora_toma:\s*(.+)$/i);
      if (horaMatch) { header.horaToma = horaMatch[1].trim(); continue; }

      const fresMatch = text.match(/^fecha_resultado:\s*(.+)$/i);
      if (fresMatch) { header.fechaResultado = fresMatch[1].trim(); }

      const fregMatch = text.match(/^fecha_registro:\s*(.+)$/i);
      if (fregMatch) { header.fechaRegistro = fregMatch[1].trim() || undefined; }
    }

    header.datosMuestra = this.parseMuestraData(lines, tipo);
    return header;
  }

  private parseMuestraData(lines: OcrSpaceLine[], tipo: TipoAnalisis): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    for (const line of lines) {
      const text = line.LineText;

      if (tipo === 'SANGRE') {
        const subMatch = text.match(/^subtipo:\s*(.+)$/i);
        if (subMatch) { data.subtipo = subMatch[1].trim(); continue; }
        const condMatch = text.match(/^condicion:\s*(.+)$/i);
        if (condMatch) { data.condicion = condMatch[1].trim(); continue; }
      }

      if (tipo === 'ORINA') {
        const subMatch = text.match(/^subtipo:\s*(.+)$/i);
        if (subMatch) { data.subtipo = subMatch[1].trim(); continue; }
        const tecMatch = text.match(/^tecnica\s+recoleccion:\s*(.+)$/i);
        if (tecMatch) { data.tecnicaRecoleccion = tecMatch[1].trim(); continue; }
        const volMatch = text.match(/^volumen_ml:\s*(.+)$/i);
        if (volMatch) { data.volumenMl = parseInt(volMatch[1].trim(), 10); continue; }
        const aspMatch = text.match(/^aspecto\s+macroscopico:\s*(.+)$/i);
        if (aspMatch) { data.aspectoMacroscopico = aspMatch[1].trim(); continue; }
      }

      if (tipo === 'HECES') {
        const consMatch = text.match(/^consistencia_entregada:\s*(.+)$/i);
        if (consMatch) { data.consistenciaEntregada = consMatch[1].trim(); continue; }
        const numMatch = text.match(/^numero\s+muestras:\s*(.+)$/i);
        if (numMatch) { data.numeroMuestras = parseInt(numMatch[1].trim(), 10); continue; }
        const diasMatch = text.match(/^dias_recoleccion:\s*(.+)$/i);
        if (diasMatch) {
          try { data.diasRecoleccion = JSON.parse(diasMatch[1].trim()); } catch { data.diasRecoleccion = diasMatch[1].trim(); }
          continue;
        }
        const notaMatch = text.match(/^nota\s+recoleccion:\s*(.+)$/i);
        if (notaMatch) { data.notaRecoleccion = notaMatch[1].trim(); continue; }
      }
    }

    return data;
  }

  private parseGroups(lines: OcrSpaceLine[], tipo: TipoAnalisis): ParsedGroup[] {
    const grupos: ParsedGroup[] = [];
    let currentGroup: ParsedGroup | null = null;
    let currentGroupLines: OcrSpaceLine[] = [];

    for (const line of lines) {
      const groupMatch = line.LineText.match(/^grupo:\s*(.+)$/i);
      if (groupMatch) {
        if (currentGroup && currentGroupLines.length > 0) {
          currentGroup.items = this.parseTable(currentGroupLines, tipo);
          grupos.push(currentGroup);
        }
        currentGroup = {
          nombreGrupo: groupMatch[1].trim(),
          orden: grupos.length + 1,
          items: [],
        };
        currentGroupLines = [];
      } else if (currentGroup) {
        currentGroupLines.push(line);
      }
    }

    if (currentGroup && currentGroupLines.length > 0) {
      currentGroup.items = this.parseTable(currentGroupLines, tipo);
      grupos.push(currentGroup);
    }

    return grupos;
  }

  private parseTable(lines: OcrSpaceLine[], _tipo: TipoAnalisis): ParsedItem[] {
    console.log(`[OcrParser] parseTable: ${lines.length} líneas recibidas`);

    const columns = this.detectColumns(lines);
    console.log(`[OcrParser] detectColumns: ${columns.length} columnas → [${columns.map(c => c.name).join(', ')}]`);

    if (columns.length === 0) {
      console.log('[OcrParser] No se detectaron columnas, intentando fallback regex');
      return this.parseTableByRegex(lines);
    }

    const headerTop = this.findHeaderTop(lines, columns);
    console.log(`[OcrParser] findHeaderTop: ${headerTop}`);

    if (headerTop == null) {
      console.log('[OcrParser] No se encontró headerTop, intentando fallback regex');
      return this.parseTableByRegex(lines);
    }

    const dataLines = lines.filter(l => Math.abs(l.MinTop - headerTop) > 2 && !l.LineText.startsWith('grupo:'));
    console.log(`[OcrParser] dataLines: ${dataLines.length} líneas después de filtrar header`);

    const rows = this.groupByTop(dataLines);
    console.log(`[OcrParser] groupByTop: ${rows.size} filas agrupadas`);

    const items: ParsedItem[] = [];

    for (const [top, rowLines] of rows) {
      const rowData = this.mapLinesToColumns(rowLines, columns);
      if (rowData.nombre && rowData.valor && rowData.valor !== 'null') {
        const existingItem = items.find(i =>
          i.nombre === rowData.nombre &&
          Math.abs((this.getTopValueForName(lines, i.nombre, top) ?? 0) - (top ?? 0)) > 10
        );
        if (!existingItem) {
          items.push({
            nombre: rowData.nombre,
            valor: rowData.valor || '',
            unidad: rowData.unidad,
            rangoMin: rowData.rangoMin,
            rangoMax: rowData.rangoMax,
            rangoReferencia: rowData.rangoReferencia,
            estado: rowData.estado,
            nota: rowData.nota,
            orden: items.length + 1,
          });
        }
      }
    }

    console.log(`[OcrParser] items extraídos: ${items.length}`);
    return items;
  }

  private detectColumns(lines: OcrSpaceLine[]): ColumnDef[] {
    const HEADER_WORDS = new Set([
      'nombre', 'valor', 'unidad', 'rango_min', 'rango_max', 'rango_referencia',
      'rango', 'estado', 'nota', 'min', 'max', 'referencia',
      'parámetro', 'parametro', 'resultado', 'ref', 'mín', 'máx',
      'rango_min', 'rango_max', 'rango_referencia'
    ]);
    const columnMap = new Map<string, number>();

    for (const line of lines) {
      for (const word of line.Words) {
        const lower = word.WordText.toLowerCase();
        if (HEADER_WORDS.has(lower) || lower === 'rango referencia' || lower === 'unidad rango') {
          const existing = columnMap.get(lower);
          if (existing == null || Math.abs(word.Left - existing) < 20) {
            columnMap.set(lower, Math.round(word.Left));
          }
        }
      }
    }

    const detected: ColumnDef[] = [];
    for (const [name, left] of columnMap) {
      if (name === 'rango' && (columnMap.has('rango_min') || columnMap.has('rango_max'))) continue;
      if (name === 'referencia' && columnMap.has('rango_referencia')) continue;
      detected.push({ name: this.normalizeColumnName(name), left, width: 40 });
    }

    detected.sort((a, b) => a.left - b.left);
    for (let i = 0; i < detected.length - 1; i++) {
      detected[i].width = detected[i + 1].left - detected[i].left;
    }

    return detected;
  }

  private normalizeColumnName(name: string): string {
    switch (name.toLowerCase()) {
      case 'nombre': return 'nombre';
      case 'valor': return 'valor';
      case 'unidad': return 'unidad';
      case 'rango_min': return 'rango_min';
      case 'rango_max': return 'rango_max';
      case 'rango_referencia': case 'rango referencia': case 'rango': return 'rango_referencia';
      case 'estado': return 'estado';
      case 'nota': return 'nota';
      case 'min': return 'rango_min';
      case 'max': return 'rango_max';
      case 'referencia': return 'rango_referencia';
      case 'unidad rango': return 'unidad';
      default: return name;
    }
  }

  private findHeaderTop(lines: OcrSpaceLine[], columns: ColumnDef[]): number | null {
    const headerNames = new Set(columns.map(c => c.name));
    for (const line of lines) {
      for (const word of line.Words) {
        if (headerNames.has(word.WordText.toLowerCase())) {
          return line.MinTop;
        }
      }
    }
    return null;
  }

  private groupByTop(lines: OcrSpaceLine[]): Map<number, OcrSpaceLine[]> {
    const groups = new Map<number, OcrSpaceLine[]>();
    for (const line of lines) {
      const top = Math.round(line.MinTop / 3) * 3;
      if (!groups.has(top)) groups.set(top, []);
      groups.get(top)!.push(line);
    }
    return groups;
  }

  private mapLinesToColumns(rowLines: OcrSpaceLine[], columns: ColumnDef[]): Record<string, string> {
    const result: Record<string, string> = {};

    for (const line of rowLines) {
      for (const word of line.Words) {
        const col = this.findColumn(word.Left, word.WordText.toLowerCase(), columns);
        if (col) {
          const key = col.name;
          result[key] = result[key] ? `${result[key]} ${word.WordText}` : word.WordText;
        } else {
          if (['null', 'normal', '[anormal]'].includes(word.WordText.toLowerCase())) continue;
          result.nombre = result.nombre || word.WordText;
        }
      }
    }

    return result;
  }

  private findColumn(left: number, wordText: string, columns: ColumnDef[]): ColumnDef | null {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const nextLeft = i < columns.length - 1 ? columns[i + 1].left : left + 200;
      if (left >= col.left - OcrParser.COLUMN_TOLERANCE && left < nextLeft) {
        return col;
      }
    }
    return columns.length > 0 ? columns[columns.length - 1] : null;
  }

  private parseFromParsedText(parsedText: string): OcrSpaceLine[] {
    const lines = parsedText.split(/\r?\n/).filter(line => line.trim().length > 0);
    return lines.map((lineText, index) => ({
      LineText: lineText.trim(),
      Words: lineText.trim().split(/\s+/).map(word => ({
        WordText: word,
        Left: 0,
        Top: index * 20,
        Height: 12,
        Width: word.length * 8,
      })),
      MaxHeight: 12,
      MinTop: index * 20,
    }));
  }

  private getTopValueForName(lines: OcrSpaceLine[], name: string, _targetTop: number): number | null {
    for (const line of lines) {
      if (line.LineText.includes(name)) {
        return line.MinTop;
      }
    }
    return null;
  }

  private parseTableByRegex(lines: OcrSpaceLine[]): ParsedItem[] {
    const items: ParsedItem[] = [];

    for (const line of lines) {
      const text = line.LineText.trim();
      if (!text || text.startsWith('grupo:') || text.length < 3) continue;

      const match = text.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ\s()]+?)\s+([\d.,-]+)\s+([a-zA-Z/]+)\s*([\d.,-]+\s*[-–]\s*[\d.,-]+)?\s*(normal|anormal|[Aa]lto|[Bb]ajo)?$/);
      if (match) {
        items.push({
          nombre: match[1].trim(),
          valor: match[2].trim(),
          unidad: match[3]?.trim(),
          rangoReferencia: match[4]?.trim(),
          estado: match[5]?.trim() || 'normal',
          orden: items.length + 1,
        });
      }
    }

    console.log(`[OcrParser] parseTableByRegex: ${items.length} items extraídos`);
    return items;
  }
}

export type { HeaderData, ParsedGroup, ParsedItem, OcrSpaceResponse };
