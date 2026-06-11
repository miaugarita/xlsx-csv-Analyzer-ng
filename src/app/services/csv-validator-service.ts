import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

import { DataTableValues, CsvValidationConfig, CsvValidationResult } from '../models/data-file-models';

export enum EstatusEnum {
  Inactivo = 0,
  Activo = 1,
}

@Injectable({ providedIn: 'root' })
export class CsValidatorService {
  //LEER CSV
  parseCsv(file: File): Promise<DataTableValues[]> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,

        complete: (result) => {
          resolve(result.data as DataTableValues[]);
        },
      });
    });
  }

  parseXlsx(file: File): Promise<DataTableValues[]> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = (event: any) => {

        const data = new Uint8Array(event.target.result);

        const workbook = XLSX.read(data, {
          type: 'array'
        });

        const firstSheet =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[firstSheet];

        const json = XLSX.utils.sheet_to_json<DataTableValues>(
          worksheet,
          {
            defval: '',
            raw: false,      // importante
            blankrows: false // importante
          }
        );

        resolve(json);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });
  }

  async parseFile(file: File): Promise<DataTableValues[]> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension) {
      throw new Error('Archivo sin extensión');
    }

    const parsers: Record<string, () => Promise<DataTableValues[]>> = {
      csv: () => this.parseCsv(file),
      xlsx: () => this.parseXlsx(file),
    };

    const parser = parsers[extension];

    if (!parser) {
      throw new Error(`Formato no soportado: ${extension}`);
    }

    return parser();
  }

  //FORMATO FECHA
  private normalizeDate(value: any): string | null {
    if (!value) return null;

    // CASO 1: si ya es Date
    if (value instanceof Date) {
      return isNaN(value.getTime())
        ? null
        : value.toISOString().split('T')[0];
    }

    // CASO 2: número de Excel (serial date)
    if (typeof value === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + value * 86400000);

      return date.toISOString().split('T')[0];
    }

    const str = String(value).trim();

    // CASO 3: DD/MM/YYYY
    if (str.includes('/')) {
      const [day, month, year] = str.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      return isNaN(date.getTime())
        ? null
        : date.toISOString().split('T')[0];
    }

    // CASO 4: ISO o cualquier parseable
    const date = new Date(str);

    return isNaN(date.getTime())
      ? null
      : date.toISOString().split('T')[0];
  }

  //VALIDAR ARCHIVO CSV
  validateCsvData(data: DataTableValues[], config: CsvValidationConfig): CsvValidationResult {
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

      // campos obligatorios
      for (const field of config.requiredFields) {
        const rawValue = String(row[field] ?? '').trim();

        if (!rawValue) {
          errors.push(`Fila ${rowNumber}: campo vacío (${field})`);
        }
      }

      // fecha
      const fechaRaw = String(row.Fecha ?? '').trim();

      const normalizedDate = this.normalizeDate(fechaRaw);

      if (!normalizedDate) {
        errors.push(`Fila ${rowNumber}: formato de fecha inválido (${fechaRaw})`);
      } else {
        const cleanRow = { ...row };
      }

      // duplicados
      const uniqueValue = String(row[config.uniqueField] ?? '').trim();

      if (seen.has(uniqueValue)) {
        errors.push(`Fila ${rowNumber}: folio duplicado (${uniqueValue})`);
      } else {
        seen.add(uniqueValue);
      }

      // numéricos
      if (config.numericFields) {
        for (const field of config.numericFields) {
          // estatus
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
}
