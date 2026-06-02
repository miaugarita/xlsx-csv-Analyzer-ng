import { DataTableValues } from '../models/csv-model';

export interface CsvValidationConfig {
  requiredFields: (keyof DataTableValues)[];
  uniqueField: keyof DataTableValues;
  numericFields?: (keyof DataTableValues)[];
}

export interface CsvValidationResult {
  isValid: boolean;
  data: DataTableValues[];
  errors: string[];
}

export enum EstatusEnum {
  Inactivo = 0,
  Activo = 1
}

// 🟡 normalizar fecha
function normalizeDate(value: string): string | null {
  if (!value) return null;

  const parts = value.split('/');

  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);

    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return null;

    return date.toISOString().split('T')[0];
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) return null;

  return date.toISOString().split('T')[0];
}

export function validateCsvData(
  data: DataTableValues[],
  config: CsvValidationConfig
): CsvValidationResult {

  const errors: string[] = [];
  const seen = new Set<string>();

  if (!data || data.length === 0) {
    return {
      isValid: false,
      data: [],
      errors: ['Archivo vacío'],
    };
  }

  for (const [index, row] of data.entries()) {
    const rowNumber = index + 1;

    // 🟢 campos obligatorios
    for (const field of config.requiredFields) {
      const rawValue = String(row[field] ?? '').trim();

      if (!rawValue) {
        errors.push(`Fila ${rowNumber}: campo vacío (${field})`);
      }
    }

    // 🟡 fecha
    const fechaRaw = String(row.Fecha ?? '').trim();
    const normalizedDate = normalizeDate(fechaRaw);

    if (!normalizedDate) {
      errors.push(`Fila ${rowNumber}: formato de fecha inválido (${fechaRaw})`);
    } else {
      row.Fecha = normalizedDate;
    }

    // 🔵 duplicados
    const uniqueValue = String(row[config.uniqueField] ?? '').trim();

    if (seen.has(uniqueValue)) {
      errors.push(`Fila ${rowNumber}: folio duplicado (${uniqueValue})`);
    } else {
      seen.add(uniqueValue);
    }

    // 🟣 numéricos normales (EXCLUYE Estatus)
    if (config.numericFields) {
      for (const field of config.numericFields) {

        if (field === 'Estatus') {
          const value = Number(row[field]);

          if (![0, 1].includes(value)) {
            errors.push(`Fila ${rowNumber}: estatus inválido (${value})`);
          }

          row.Estatus = value as EstatusEnum;
          continue;
        }

        const value = row[field];

        if (value !== null && value !== undefined && isNaN(Number(value))) {
          errors.push(`Fila ${rowNumber}: ${String(field)} inválido`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    data,
    errors,
  };
}
