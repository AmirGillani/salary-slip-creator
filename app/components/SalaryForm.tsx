"use client";

import React, { ChangeEvent } from "react";
import { SalaryDetails } from "../types";

interface SalaryFormProps {
  data: SalaryDetails;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SalaryForm({ data, onChange, onLogoUpload }: SalaryFormProps) {
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100">
        Enter Salary Details
      </h2>

      <div className="space-y-6">
        {/* Company Details Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-zinc-700 dark:text-zinc-300 border-b pb-2 border-zinc-200 dark:border-zinc-700">
            Company Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
             <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Company Logo
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={onLogoUpload}
                className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <InputField
              label="Company Name"
              name="companyName"
              value={data.companyName}
              onChange={onChange}
              placeholder="Acme Corp Inc."
            />
            <InputField
              label="Company Address"
              name="companyAddress"
              value={data.companyAddress}
              onChange={onChange}
              placeholder="123 Business Rd, Tech City"
            />
          </div>
        </div>

        {/* Employee Details Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-zinc-700 dark:text-zinc-300 border-b pb-2 border-zinc-200 dark:border-zinc-700">
            Employee Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Employee Name"
              name="employeeName"
              value={data.employeeName}
              onChange={onChange}
              placeholder="John Doe"
            />
            <InputField
              label="Designation"
              name="designation"
              value={data.designation}
              onChange={onChange}
              placeholder="Software Engineer"
            />
            <InputField
              label="Employee ID"
              name="employeeId"
              value={data.employeeId}
              onChange={onChange}
              placeholder="EMP-001"
            />
            <InputField
              label="Department"
              name="department"
              value={data.department}
              onChange={onChange}
              placeholder="Engineering"
            />
            <InputField
              label="Month & Year"
              name="monthYear"
              value={data.monthYear}
              onChange={onChange}
              placeholder="November 2025"
            />
             <InputField
              label="PAN Number"
              name="panNumber"
              value={data.panNumber}
              onChange={onChange}
              placeholder="ABCDE1234F"
            />
            <InputField
              label="Bank Name"
              name="bankName"
              value={data.bankName}
              onChange={onChange}
              placeholder="HDFC Bank"
            />
            <InputField
              label="Account Number"
              name="accountNumber"
              value={data.accountNumber}
              onChange={onChange}
              placeholder="1234567890"
            />
          </div>
        </div>

        {/* Earnings Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400 border-b pb-2 border-green-200 dark:border-green-900">
            Earnings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Basic Salary"
              name="basicSalary"
              type="number"
              value={data.basicSalary}
              onChange={onChange}
            />
            <InputField
              label="HRA"
              name="hra"
              type="number"
              value={data.hra}
              onChange={onChange}
            />
            <InputField
              label="Conveyance Allowance"
              name="conveyanceAllowance"
              type="number"
              value={data.conveyanceAllowance}
              onChange={onChange}
            />
            <InputField
              label="Medical Allowance"
              name="medicalAllowance"
              type="number"
              value={data.medicalAllowance}
              onChange={onChange}
            />
            <InputField
              label="Special Allowance"
              name="specialAllowance"
              type="number"
              value={data.specialAllowance}
              onChange={onChange}
            />
            <InputField
              label="Other Earnings"
              name="otherEarnings"
              type="number"
              value={data.otherEarnings}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Deductions Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400 border-b pb-2 border-red-200 dark:border-red-900">
            Deductions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Provident Fund (PF)"
              name="pf"
              type="number"
              value={data.pf}
              onChange={onChange}
            />
            <InputField
              label="Professional Tax"
              name="professionalTax"
              type="number"
              value={data.professionalTax}
              onChange={onChange}
            />
            <InputField
              label="TDS (Tax)"
              name="tds"
              type="number"
              value={data.tds}
              onChange={onChange}
            />
            <InputField
              label="Other Deductions"
              name="otherDeductions"
              type="number"
              value={data.otherDeductions}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}
