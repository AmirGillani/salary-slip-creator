import mongoose from 'mongoose';

const SalarySlipSchema = new mongoose.Schema({
  companyName: { type: String, default: '' },
  companyAddress: { type: String, default: '' },
  companyLogo: { type: String, default: '' }, // Base64 string

  employeeName: { type: String, required: true },
  designation: { type: String, default: '' },
  employeeId: { type: String, default: '' },
  department: { type: String, default: '' },
  monthYear: { type: String, required: true },
  bankName: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },

  // Earnings
  basicSalary: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  conveyanceAllowance: { type: Number, default: 0 },
  medicalAllowance: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  otherEarnings: { type: Number, default: 0 },

  // Deductions
  pf: { type: Number, default: 0 },
  professionalTax: { type: Number, default: 0 },
  tds: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SalarySlip || mongoose.model('SalarySlip', SalarySlipSchema);

