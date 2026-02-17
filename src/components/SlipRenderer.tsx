"use client";

import React, { useState, useEffect } from 'react';
import { SalarySlipLayout, SalarySlipInput } from '@/lib/salary-types';
import { cn } from '@/lib/utils';
import { addMonths, startOfMonth, endOfMonth, format, parseISO } from 'date-fns';

interface SlipRendererProps {
  layout: SalarySlipLayout;
  data: SalarySlipInput;
}

export default function SlipRenderer({ layout, data }: SlipRendererProps) {
  const [rotations, setRotations] = useState<{ sig: number; stamp: number }[]>([]);

  useEffect(() => {
    // Generate random rotations for up to 4 receipts
    const newRotations = Array.from({ length: 4 }).map(() => ({
      sig: Math.floor(Math.random() * 11) - 5,
      stamp: Math.floor(Math.random() * 11) - 5,
    }));
    setRotations(newRotations);
  }, [data]);

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "";
    if (type === 'amount') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
    }
    if (type === 'date') {
      const date = typeof value === 'string' ? parseISO(value) : value;
      return format(date, 'dd-MMM-yyyy');
    }
    return String(value);
  };

  // Logic to split the data into multiple periods if quarterly
  const getPeriods = () => {
    if (data.period !== 'Quarterly') {
      return [{ start: data.paymentPeriodStart, end: data.paymentPeriodEnd }];
    }

    const baseStart = parseISO(data.paymentPeriodStart);
    const periods = [];
    for (let i = 0; i < 4; i++) {
      const qStart = addMonths(baseStart, i * 3);
      const qEnd = endOfMonth(addMonths(qStart, 2));
      periods.push({
        start: format(qStart, 'yyyy-MM-dd'),
        end: format(qEnd, 'yyyy-MM-dd')
      });
    }
    return periods;
  };

  const activePeriods = getPeriods();

  return (
    <div className="space-y-8 print:space-y-0">
      {activePeriods.map((period, idx) => (
        <div 
          key={idx} 
          className="bg-white p-8 md:p-12 min-h-[500px] flex flex-col print-container text-[#1a1a1a] font-serif leading-tight border-4 border-double border-gray-300 relative overflow-hidden break-after-page print:mb-0 mb-8"
        >
          {/* Header Date */}
          <div className="flex justify-end mb-4">
            <div className="text-sm">
              <span className="font-bold">Date:</span> {formatValue(period.start, 'date')}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-6 tracking-tight uppercase border-b border-black pb-2 self-center w-fit px-12">
            Driver Salary Receipt
          </h2>

          {/* Body */}
          <div className="space-y-4 mb-8">
            <p className="text-lg leading-relaxed text-justify indent-12">
              This is to certify that Mr./Ms. <span className="font-bold border-b border-black px-1">{data.employerName}</span> have paid <span className="font-bold border-b border-black px-1">{formatValue(data.totalSalary, 'amount')}</span> to driver Mr/Ms <span className="font-bold border-b border-black px-1">{data.driverName}</span> towards salary of the period <span className="font-bold border-b border-black px-1">{formatValue(period.start, 'date')} to {formatValue(period.end, 'date')}</span> (Acknowledged receipt enclosed). I also declare that the driver is exclusively utilized for official purpose only.
            </p>
            <p className="text-lg leading-relaxed text-justify">
              Please reimburse the above amount. I further declare that what is stated above is correct and true.
            </p>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="flex gap-2 items-baseline">
              <span className="font-bold">Vehicle Number:</span>
              <span className="font-bold border-b border-black flex-1 px-2">{data.vehicleNumber}</span>
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="font-bold">Period:</span>
              <span className="border-b border-black flex-1 px-2">{formatValue(period.start, 'date')} to {formatValue(period.end, 'date')}</span>
            </div>
          </div>

          <div className="flex gap-2 items-baseline mb-12">
            <span className="font-bold">Driver Name:</span>
            <span className="font-bold border-b border-black flex-1 px-2">{data.driverName}</span>
          </div>

          {/* Auth Section - Overlapping style */}
          <div className="mt-auto flex justify-between items-end relative pb-4">
            <div className="flex flex-col items-center min-w-[150px]">
              <div className="h-20 w-20 border border-gray-200 flex items-center justify-center text-[10px] text-gray-300">
                PHOTO SPACE
              </div>
            </div>

            <div className="relative min-w-[250px] h-32 flex items-center justify-center">
              {/* Stamp (Base) */}
              <div className="absolute left-4 bottom-4 w-24 h-24 flex items-center justify-center">
                {data.stampDataUri ? (
                  <img 
                    src={data.stampDataUri} 
                    alt="Stamp" 
                    className="w-full h-full object-contain"
                    style={{ transform: `rotate(${rotations[idx]?.stamp || 0}deg)` }}
                  />
                ) : (
                  <div className="w-20 h-20 border-2 border-red-200 flex items-center justify-center text-[8px] text-red-300 uppercase font-bold text-center">
                    Revenue<br/>Stamp
                  </div>
                )}
              </div>

              {/* Signature (Overlapping) */}
              <div className="absolute right-4 bottom-6 w-48 h-24 z-10 pointer-events-none">
                {data.signatureDataUri && (
                  <img 
                    src={data.signatureDataUri} 
                    alt="Signature" 
                    className="w-full h-full object-contain mix-blend-multiply opacity-95"
                    style={{ transform: `rotate(${rotations[idx]?.sig || 0}deg)` }}
                  />
                )}
              </div>
              
              <div className="absolute bottom-0 w-full border-t border-black pt-1 text-center">
                <span className="text-xs font-bold uppercase tracking-widest">Signature & Stamp</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest no-print">
            System Generated Receipt - DrivePay
          </div>
        </div>
      ))}
    </div>
  );
}
