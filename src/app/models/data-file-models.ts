// definir la estructura de los datos
export interface DataTableValues {
  Folio: string;
  Fecha: string;
  Categoria: string;
  Monto: number;
  Estatus: number; //por que no fue booleano?
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

export interface CsvSummary {
  totalRecords: number;
  totalAmount: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
}

