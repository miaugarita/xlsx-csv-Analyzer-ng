export interface CsvSummary {
  totalRecords: number;
  totalAmount: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
}
