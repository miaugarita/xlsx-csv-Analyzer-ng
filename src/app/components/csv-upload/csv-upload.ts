import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { CsvApiService } from '../../services/csv-validator-service';
import { CsvSummaryComponent } from '../csv-summary/csv-summary';
import { DataTableValues } from '../../models/model';

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

  summary = {
    totalRecords: 0,
    totalAmount : 0,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
  };

  //INYECTAR SERVICIO
  constructor(
    private csvApiService: CsvApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  // seleccionar archivo
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  // procesar CSV
  async onUpload() {
    console.log('CLICK');

    if (!this.file) {
      console.log('No file selected');
      return;
    }

    console.log('Procesando:', this.file.name);

    //parsear CSV
    const parsedData = await this.csvApiService.parseCsv(this.file);

    console.log('Datos parseados:', parsedData);

    //validar CSV
    const validation = this.csvApiService.validateCsvData(parsedData, {
      requiredFields: ['Folio', 'Fecha', 'Categoria', 'Monto', 'Estatus'],
      uniqueField: 'Folio',
      numericFields: ['Monto', 'Estatus'],
    });

    this.errors = validation.errors;

    // detener flujo si hay errores
    if (!validation.isValid) {
      this.data = [];
      this.cdr.detectChanges();
      return;
    }

    this.data = [...validation.data];

    this.generateSummary(); //llamar fn resumen

    //refrescar
    this.cdr.detectChanges();
  }

  private generateSummary(): void {

    this.summary = {
      totalRecords: this.data.length,
      totalAmount: 0,
      byStatus: {},
      byCategory: {},
    };

    this.data.forEach((item) => {
      // Suma de montos
      this.summary.totalAmount += Number(item.Monto);

      // Agrupar por estatus
      const estatus = Number(item.Estatus) === 1 ? 'Activo' : 'Inactivo';

      this.summary.byStatus[estatus] = (this.summary.byStatus[estatus] || 0) + 1;

      // Agrupar por categoría
      this.summary.byCategory[item.Categoria] =
        (this.summary.byCategory[item.Categoria] || 0) + 1;
    });

    console.log('RESUMEN',this.summary);
  }
}
