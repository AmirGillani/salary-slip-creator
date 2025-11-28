"use client";

import React, { useEffect, useState, useRef } from "react";
import { SalaryDetails } from "../../types";
import SalarySlip from "../components/SalarySlip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface SalarySlipRecord extends SalaryDetails {
  _id: string;
  createdAt: string;
}

export default function Dashboard() {
  const [slips, setSlips] = useState<SalarySlipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState<SalarySlipRecord | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSlips();
  }, []);

  const fetchSlips = async () => {
    try {
      const res = await fetch("/api/salary-slips");
      const data = await res.json();
      if (data.success) {
        setSlips(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch slips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this salary slip?")) return;

    try {
      const res = await fetch(`/api/salary-slips?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSlips(slips.filter((slip) => slip._id !== id));
        if (selectedSlip?._id === id) setSelectedSlip(null);
      } else {
        alert("Failed to delete slip");
      }
    } catch (error) {
      console.error("Error deleting slip:", error);
    }
  };

  const handleDownloadPDF = async (slip: SalarySlipRecord) => {
     // We need to render the slip temporarily to capture it
    setSelectedSlip(slip);
    // Allow react to render
    setTimeout(async () => {
        if (!printRef.current) return;
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowHeight: printRef.current.scrollHeight + 100,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = position - pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Salary_Slip_${slip.employeeName}_${slip.monthYear}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Salary Slips Dashboard
          </h1>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create New Slip
          </a>
        </div>

        {loading ? (
          <p className="text-center text-zinc-500">Loading...</p>
        ) : slips.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">No salary slips found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slips.map((slip) => (
              <div
                key={slip._id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                      {slip.employeeName}
                    </h3>
                    <p className="text-sm text-zinc-500">{slip.designation}</p>
                  </div>
                  <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-md">
                    {slip.monthYear}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                   <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span className="font-medium">{slip.basicSalary}</span>
                   </div>
                   <div className="flex justify-between">
                        <span>Net Payable:</span>
                         {/* We can calculate net here or store it in DB. Calculating for now */}
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            { new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(
                                (slip.basicSalary + slip.hra + slip.conveyanceAllowance + slip.medicalAllowance + slip.specialAllowance + slip.otherEarnings) -
                                (slip.pf + slip.professionalTax + slip.tds + slip.otherDeductions)
                            )}
                        </span>
                   </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPDF(slip)}
                    disabled={isGeneratingPDF}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isGeneratingPDF && selectedSlip?._id === slip._id ? "Generating..." : "Download PDF"}
                  </button>
                  <button
                    onClick={() => handleDelete(slip._id)}
                    className="px-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Container for PDF Generation */}
      {selectedSlip && (
        <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
            <div className="w-[210mm] bg-white">
                <SalarySlip ref={printRef} data={selectedSlip} />
            </div>
        </div>
      )}
    </div>
  );
}

