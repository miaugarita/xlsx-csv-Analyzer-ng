import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatDividerModule, MatIconModule ],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class App {

  //inicializar variable para almacenar archivo
  file: File | null = null;

  //Fn: guardar archivo seleccionado en variable : file
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (!this.file) {
      console.log('No file selected');
    }
  }


}
