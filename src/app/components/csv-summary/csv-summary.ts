import { Component, Input } from '@angular/core';
import { CommonModule, } from '@angular/common';

import { CsvSummary } from '../../models/data-file-models';

@Component({
  selector: 'csv-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv-summary.html',
  styleUrl: './csv-summary.scss'
})

export class CsvSummaryComponent {
  @Input()
  summary!: CsvSummary;
}
