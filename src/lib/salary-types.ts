
export interface SalaryItem {
  item: string;
  amount: number;
}

export interface SalarySlipInput {
  companyName: string;
  companyAddress: string;
  employerName: string;
  billDate: string;
  period: 'Monthly' | 'Quarterly' | 'Custom';
  paymentPeriodStart: string;
  paymentPeriodEnd: string;
  startDateFY: string;
  billNumber: string | null;
  driverName: string;
  vehicleNumber: string;
  salaryBreakdown: SalaryItem[];
  totalSalary: number;
  signatureDataUri: string | null;
  stampDataUri: string | null;
}

export interface LayoutElement {
  type: 'text' | 'amount' | 'date' | 'paragraph' | 'image' | 'salaryBreakdownTable';
  key?: string;
  label?: string;
  content?: string;
  emphasize?: boolean;
  alignment?: 'left' | 'center' | 'right';
  positionHint?: string;
}

export interface LayoutSection {
  title?: string;
  elements: LayoutElement[];
  layoutHint?: string;
}

export interface SalarySlipLayout {
  sections: LayoutSection[];
  overallDesignGoal?: string;
}
