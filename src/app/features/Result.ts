export interface Result<DataType> {
  status?: number;
  data?: DataType;
  messages?: string[];
}
