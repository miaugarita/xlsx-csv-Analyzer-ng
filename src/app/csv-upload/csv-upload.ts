import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { CsvApiService } from '../services/api-csv';
import { validateCsvData } from '../services/csv-validator-service';
import { DataTableValues } from '../models/csv-model';

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './csv-upload.html',
  styleUrl: './upload.scss',
})
export class CsvUploadComponent {

  file: File | null = null;
  data: DataTableValues[] = [];

  displayedColumns = ['Folio', 'Fecha', 'Categoria', 'Monto', 'Estatus'];

  constructor(private csvService: CsvApiService) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  async onUpload() {
    if (!this.file) return;

    // 1. parseo (service)
    const parsedData = await this.csvService.parseCsv(this.file);

    // 2. validación
    const validation = validateCsvData(parsedData, {
      requiredFields: ['Folio', 'Fecha', 'Categoria', 'Monto', 'Estatus'],
      uniqueField: 'Folio',
      numericFields: ['Monto'],
    });

    if (!validation.isValid) {
      console.log('ERRORES CSV:', validation.errors);
      return;
    }

    // 3. resultado
    this.data = validation.data;
    console.log('CSV VALIDADO ✔️', this.data);
  }
}
