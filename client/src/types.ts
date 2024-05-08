export type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type Data = {
  id?: number;
  totalCarbonSavings?: number;
  totalDieselSavings?: number;
  savingsPerDay?: {
    [date: string]: { carbonSavings: number; dieselSavings: number };
  }[];
  savingsPerMonth?: {
    [month: string]: { carbonSavings: number; dieselSavings: number };
  }[];
};

export type ApiData = {
  data: Data;
  error: string | null;
};
