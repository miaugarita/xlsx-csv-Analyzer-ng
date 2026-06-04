export interface DataTableValues {
  Folio: string;
  Fecha: string;
  Categoria: string;
  Monto: number;
  Estatus: number;
}


export interface CsvValidationConfig {
  requiredFields: (keyof DataTableValues)[];
  uniqueField: keyof DataTableValues;
  numericFields?: (keyof DataTableValues)[];
}

export interface CsvValidationResult {
  isValid: boolean;
  data: DataTableValues[];
  errors: string[];
}
