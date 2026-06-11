import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { CsValidatorService } from '../../services/csv-validator-service';
import { CsvSummaryService } from '../../services/csv-summary-service';
import { CsvSummaryComponent } from '../csv-summary/csv-summary';
import { DataTableValues, CsvSummary } from '../../models/data-file-models';

@Component({
  selector: 'csv-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, CsvSummaryComponent],
  templateUrl: './csv-upload.html',
  styleUrl: './csv-upload.scss',
})
export class CsvUploadComponent {
  //variables
  file: File | null = null; // archivo seleccionado
  data: DataTableValues[] = []; // datos válidos
  errors: string[] = []; // errores

  displayedColumns: string[] = [
    // columnas tabla
    'Folio',
    'Fecha',
    'Categoria',
    'Monto',
    'Estatus',
  ];

  summary: CsvSummary = {
    totalRecords: 0,
    totalAmount: 0,
    byStatus: {},
    byCategory: {},
  };

  //INYECTAR SERVICIO
  constructor(
    private CsValidatorService: CsValidatorService,
    private CsvSummaryService: CsvSummaryService,
    private cdr: ChangeDetectorRef,
  ) {}

  // seleccionar archivo
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  // procesar CSV
  async onUpload() {

    if (!this.file) {
      console.log('No file selected');
      return;
    }

    //parsear archivo
    const parsedData = await this.CsValidatorService.parseFile(this.file);

    //validar archivo
    const validation = this.CsValidatorService.validateCsvData(parsedData, {
      requiredFields: ['Folio', 'Fecha', 'Categoria', 'Monto', 'Estatus'],
      uniqueField: 'Folio',
      numericFields: ['Monto', 'Estatus'],
    });

    this.errors = validation.errors;

    // detener flujo si hay errores
    if (!validation.isValid) {
      this.resetData();
      this.cdr.detectChanges();
      return;
    }

    this.data = [...validation.data];

    this.summary = this.CsvSummaryService.generateSummary(this.data);

    //refrescar
    this.cdr.detectChanges();
  }

  //limpiar datos
  private resetData(): void {
      this.data = [];
      this.summary = {
        totalRecords: 0,
        totalAmount: 0,
        byStatus: {},
        byCategory: {}
      };
    }
}
