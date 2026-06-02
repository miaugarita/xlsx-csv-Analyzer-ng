//manejo de validaciones en lectura de el archivo

export interface CsvValidationResult<T> {
  isValid: boolean;
  data: T[];
  errors: string[];
}

export function validateCsvData<T extends Record<string, any>>(
  data: T[],
  config: {
    requiredFields: string[];
    uniqueField: string;
    numericFields?: string[];
  }
): CsvValidationResult<T> {
  const errors: string[] = [];
  const uniqueValues = new Set<string>();

  if (!data || data.length === 0 || Object.keys(data[0]).length === 0) {
    return {
      isValid: false,
      data: [],
      errors: ['❌ El CSV está vacío o solo contiene cabeceras'],
    };
  }

  for (const [index, item] of data.entries()) {
    const row = index + 1;

    //____________campos obligatorios
    for (const field of config.requiredFields) {
      if (!String(item[field] ?? '').trim()) {
        errors.push(`❌ Fila ${row}: campo vacío (${field})`);
      }
    }

    //____________duplicados
    const uniqueValue = String(item[config.uniqueField] ?? '').trim();
    if (uniqueValues.has(uniqueValue)) {
      errors.push(`❌ Fila ${row}: duplicado (${uniqueValue})`);
    } else {
      uniqueValues.add(uniqueValue);
    }

    //____________campos numéricos
    if (config.numericFields) {
      for (const field of config.numericFields) {
        if (item[field] !== undefined && isNaN(Number(item[field]))) {
          errors.push(`❌ Fila ${row}: ${field} inválido`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    data,
    errors,
  };
}
