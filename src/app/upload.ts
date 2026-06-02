import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import * as Papa from 'papaparse';


// Interface para estructura de datos CSV
interface DataTableValues {
  Folio: string;
  Fecha: string;
  Categoria: string;
  Monto: string;
  Estatus: string;
}


@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule
  ],

  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})

export class App {

  // archivo seleccionado
  file: File | null = null;

  // datos CSV
  data: DataTableValues[] = [];

  // columnas tabla material
  displayedColumns: string[] = [
    'Folio',
    'Fecha',
    'Categoria',
    'Monto',
    'Estatus'
  ];


  // guardar archivo seleccionado
  onFileSelected(event: any) {

    this.file = event.target.files[0];

    if (!this.file) {
      console.log('No file selected');
    }
  }


  // leer CSV
  onUpload() {
    if (!this.file) {
      console.log('No file selected');
      return;
    }

    Papa.parse(this.file, {

      header: true,
      skipEmptyLines: true,

      complete: (result) => {

        this.data = [...result.data as DataTableValues[]];

        console.log('CSV DATOS:', this.data);

      }

    });
  }

}
