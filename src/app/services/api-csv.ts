import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { DataTableValues } from '../models/csv-model';

@Injectable({ providedIn: 'root' })
export class CsvApiService {

  parseCsv(file: File): Promise<DataTableValues[]> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          resolve(result.data as DataTableValues[]);
        }
      });
    });
  }
}
