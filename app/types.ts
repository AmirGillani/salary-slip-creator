export interface SalaryDetails {
  // Company Details
  companyName: string;
  companyAddress: string;
  companyLogo?: string;

  // Employee Details
  employeeName: string;
  designation: string;
  employeeId: string;
  department: string;
  monthYear: string;
  bankName: string;
  accountNumber: string;
  panNumber: string;
  
  // Earnings
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherEarnings: number;
  
  // Deductions
  pf: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
}
