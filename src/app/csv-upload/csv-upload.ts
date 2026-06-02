import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import * as Papa from 'papaparse';

import { DataTableValues } from '../models/csv-model';
import { validateCsvData } from '../csv-validators/csv-validator';

@Component({
  selector: 'csv-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './csv-upload.html',
  styleUrl: './csv-upload.scss',
})
export class CsvUploadComponent {

  //archivo seleccionado
  file: File | null = null;

  //datos válidos
  data: DataTableValues[] = [];

  errors: string[] = [];

  displayedColumns: string[] = [
    'Folio',
    'Fecha',
    'Categoria',
    'Monto',
    'Estatus'
  ];

  //seleccionar archivo
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  //procesar CSV
  onUpload() {
    if (!this.file) {
      console.log('No file selected');
      return;
    }

    Papa.parse(this.file, {
      header: true,
      skipEmptyLines: true,

      complete: (result) => {
        const parsedData = result.data as DataTableValues[];

        // 🧪 validación
        const validation = validateCsvData(parsedData, {
          requiredFields: ['Folio', 'Fecha', 'Categoria', 'Monto', 'Estatus'],
          uniqueField: 'Folio',
          numericFields: ['Monto'],
        });

        //guardar errores para UI
        this.errors = validation.errors;

        //si hay errores, detener flujo
        if (!validation.isValid) {
          this.data = [];
          return;
        }

        //datos válidos
        this.data = validation.data;

        console.log('CSV VALIDADO ✔️', this.data);
      },
    });
  }
}
