import React, { forwardRef } from 'react';
import { SalaryDetails } from "../types";

interface SalarySlipProps {
  data: SalaryDetails & { companyName?: string; companyAddress?: string; companyLogo?: string };
  earnings?: { label: string; value: number }[];
  deductions?: { label: string; value: number }[];
  totals?: { totalEarnings: number; totalDeductions: number; netSalary: number };
}

const SalarySlipPreview = forwardRef<HTMLDivElement, SalarySlipProps>(({ data, earnings: propsEarnings, deductions: propsDeductions, totals: propsTotals }, ref) => {
  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Calculate earnings if not provided
  const earnings = propsEarnings || [
    { label: "Basic Salary", value: Number(data.basicSalary) || 0 },
    { label: "HRA", value: Number(data.hra) || 0 },
    { label: "Conveyance", value: Number(data.conveyanceAllowance) || 0 },
    { label: "Medical", value: Number(data.medicalAllowance) || 0 },
    { label: "Special Allowance", value: Number(data.specialAllowance) || 0 },
    { label: "Other Earnings", value: Number(data.otherEarnings) || 0 },
  ];

  // Calculate deductions if not provided
  const deductions = propsDeductions || [
    { label: "Provident Fund", value: Number(data.pf) || 0 },
    { label: "Professional Tax", value: Number(data.professionalTax) || 0 },
    { label: "TDS (Tax)", value: Number(data.tds) || 0 },
    { label: "Other Deductions", value: Number(data.otherDeductions) || 0 },
  ];

  // Calculate totals if not provided
  const totals = propsTotals || (() => {
    const totalEarnings = earnings.reduce((sum, item) => sum + item.value, 0);
    const totalDeductions = deductions.reduce((sum, item) => sum + item.value, 0);
    const netSalary = totalEarnings - totalDeductions;
    return { totalEarnings, totalDeductions, netSalary };
  })();

  return (
    <div ref={ref} className="bg-[#ffffff] p-8 min-h-[600px]" id="salary-slip">
      {/* Header */}
      <div className="text-center pb-6 border-b-2 border-[#1e293b]">
        {data.companyLogo && (
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.companyLogo} alt="Company Logo" className="h-16 object-contain" />
          </div>
        )}
        <h1 className="text-2xl font-bold text-[#1e293b] tracking-wide">
          {data.companyName || 'COMPANY NAME'}
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          {data.companyAddress || 'Company Address'}
        </p>
      </div>

      {/* Title */}
      <div className="text-center py-4">
        <h2 className="text-lg font-semibold text-[#334155] underline underline-offset-4 decoration-2">
          Salary Slip for {data.monthYear || 'Month Year'}
        </h2>
      </div>

      {/* Employee Details Grid */}
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 py-4 text-sm border-b border-[#e2e8f0]">
        <div className="flex">
          <span className="text-[#64748b] w-32">Employee Name:</span>
          <span className="font-medium text-[#1e293b]">{data.employeeName || '-'}</span>
        </div>
        <div className="flex">
          <span className="text-[#64748b] w-32">Designation:</span>
          <span className="font-medium text-[#1e293b]">{data.designation || '-'}</span>
        </div>
        <div className="flex">
          <span className="text-[#64748b] w-32">Employee ID:</span>
          <span className="font-medium text-[#1e293b]">{data.employeeId || '-'}</span>
        </div>
        <div className="flex">
          <span className="text-[#64748b] w-32">Department:</span>
          <span className="font-medium text-[#1e293b]">{data.department || '-'}</span>
        </div>
        <div className="flex">
          <span className="text-[#64748b] w-32">PAN Number:</span>
          <span className="font-medium text-[#1e293b]">{data.panNumber || '-'}</span>
        </div>
        <div className="flex">
          <span className="text-[#64748b] w-32">Bank Name:</span>
          <span className="font-medium text-[#1e293b]">{data.bankName || '-'}</span>
        </div>
        <div className="flex">
          <span className="text-[#64748b] w-32">Account No:</span>
          <span className="font-medium text-[#1e293b]">{data.accountNumber || '-'}</span>
        </div>
      </div>

      {/* Earnings & Deductions Table */}
      <div className="py-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Earnings Column */}
          <div>
            <div className="bg-[#ecfdf5] px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold text-[#065f46] text-sm uppercase tracking-wide">Earnings</h3>
            </div>
            <div className="border border-t-0 border-[#e2e8f0] rounded-b-lg">
              {earnings.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between px-4 py-2.5 text-sm ${index % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-[#ffffff]'}`}
                >
                  <span className="text-[#475569]">{item.label}</span>
                  <span className="font-medium text-[#1e293b]">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 bg-[#ecfdf5] border-t border-[#d1fae5] font-semibold">
                <span className="text-[#065f46]">Total Earnings</span>
                <span className="text-[#065f46]">{formatCurrency(totals.totalEarnings)}</span>
              </div>
            </div>
          </div>

          {/* Deductions Column */}
          <div>
            <div className="bg-[#fff1f2] px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold text-[#9f1239] text-sm uppercase tracking-wide">Deductions</h3>
            </div>
            <div className="border border-t-0 border-[#e2e8f0] rounded-b-lg">
              {deductions.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between px-4 py-2.5 text-sm ${index % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-[#ffffff]'}`}
                >
                  <span className="text-[#475569]">{item.label}</span>
                  <span className="font-medium text-[#1e293b]">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 bg-[#fff1f2] border-t border-[#ffe4e6] font-semibold">
                <span className="text-[#9f1239]">Total Deductions</span>
                <span className="text-[#9f1239]">{formatCurrency(totals.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary & Signatures Section - Forced Page Break Before */}
      <div className="break-before-page">
        {/* Net Salary */}
        <div className="bg-[#1e293b] rounded-xl p-6 text-center mb-12">
          <p className="text-[#cbd5e1] text-sm uppercase tracking-wider mb-1">Net Salary Payable</p>
          <p className="text-3xl font-bold text-[#ffffff]">{formatCurrency(totals.netSalary)}</p>
          <p className="text-[#94a3b8] text-xs mt-1">(Total Earnings - Total Deductions)</p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8">
          <div className="text-center">
            <div className="border-t border-[#cbd5e1] pt-2 mx-8">
              <p className="text-sm text-[#475569]">Employee Signature</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-[#cbd5e1] pt-2 mx-8">
              <p className="text-sm text-[#475569]">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#94a3b8] mt-8">
          This is a computer-generated document and does not require a physical signature.
        </p>
      </div>
    </div>
  );
});

SalarySlipPreview.displayName = 'SalarySlipPreview';

export default SalarySlipPreview;
