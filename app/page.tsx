"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import SalaryForm from "./components/SalaryForm";
import SalarySlip from "./components/SalarySlip";
import { SalaryDetails } from "./types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const initialData: SalaryDetails = {
  companyName: "Devs & Logics",
  companyAddress: "123 Tech Street New York, NY 10001",
  companyLogo: "https://media.licdn.com/dms/image/v2/D4D0BAQH_EHmPibetvg/company-logo_200_200/B4DZbj9e0zG8AI-/0/1747581267709/devs_logic_logo?e=2147483647&v=beta&t=amVz778BKOFNH6NSK2oMVTCC_TJlUtvo10KPu_VHIcU",
  employeeName: "John Doe",
  designation: "Senior Software Engineer",
  employeeId: "EMP-2024-001",
  department: "Engineering",
  monthYear: "November 2025",
  bankName: "HDFC Bank",
  accountNumber: "1234567890",
  panNumber: "ABCDE1234F",
  basicSalary: 50000,
  hra: 25000,
  conveyanceAllowance: 1600,
  medicalAllowance: 1250,
  specialAllowance: 10000,
  otherEarnings: 0,
  pf: 1800,
  professionalTax: 200,
  tds: 2500,
  otherDeductions: 0,
};

export default function Home() {
  const [salaryData, setSalaryData] = useState<SalaryDetails>(initialData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const salarySlipRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSalaryData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSalaryData((prev) => ({
          ...prev,
          companyLogo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!salarySlipRef.current) return;

    setIsGeneratingPDF(true);

    try {
      // Wait for images to load properly before capturing
      const canvas = await html2canvas(salarySlipRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowHeight: salarySlipRef.current.scrollHeight + 100, // Ensure full height capture
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = position - pageHeight; // Shift image up
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Salary_Slip_${salaryData.monthYear || "Draft"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/salary-slips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Salary slip saved successfully!");
      } else {
        alert("Failed to save salary slip.");
      }
    } catch (error) {
      console.error("Error saving slip:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black pb-10">
      {/* Header - Hidden in print */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-4 px-6 mb-8 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-blue-600"
            >
              <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
              <path
                fillRule="evenodd"
                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
                clipRule="evenodd"
              />
              <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
            </svg>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Salary Slip Creator
          </h1>
          </div>
          
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium transition-colors mr-2"
            >
              View Dashboard
            </a>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isSaving ? "Saving..." : "Save Slip"}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 px-4 py-2 rounded-lg font-medium transition-colors border border-zinc-300 dark:border-zinc-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                />
              </svg>
              Print
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isGeneratingPDF ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              )}
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 print:hidden">
          <SalaryForm 
            data={salaryData} 
            onChange={handleInputChange} 
            onLogoUpload={handleLogoUpload}
          />
        </div>

        {/* Preview Section */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-8">
            <div className="bg-zinc-200 dark:bg-zinc-800 p-4 rounded-xl mb-4 print:hidden">
              <h2 className="text-lg font-semibold text-center text-zinc-700 dark:text-zinc-300">
                Live Preview
              </h2>
            </div>
            <SalarySlip ref={salarySlipRef} data={salaryData} />
          </div>
        </div>
      </main>
    </div>
  );
}
