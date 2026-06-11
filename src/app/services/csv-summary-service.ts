import { Injectable } from '@angular/core';
import { DataTableValues, CsvSummary } from '../models/data-file-models';

@Injectable({
  providedIn: 'root',
})
export class CsvSummaryService {

  generateSummary(data: DataTableValues[]): CsvSummary {

    const summary: CsvSummary = {
      totalRecords: data.length,
      totalAmount: 0,
      byStatus: {},
      byCategory: {},
    };

    data.forEach((item) => {

      summary.totalAmount += Number(item.Monto);

      const estatus =
        Number(item.Estatus) === 1 ? 'Activo' : 'Inactivo';

      summary.byStatus[estatus] =
        (summary.byStatus[estatus] || 0) + 1;

      summary.byCategory[item.Categoria] =
        (summary.byCategory[item.Categoria] || 0) + 1;
    });

    return summary;
  }
}
