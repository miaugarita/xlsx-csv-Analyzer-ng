import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csv-validator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'csv-validator.html',
  styleUrl: 'csv-validator.scss'
})
export class CsvValidatorComponent {
  @Input()
  errors: string[] = [];
}
