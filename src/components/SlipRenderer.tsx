"use client";

import React from 'react';
import { GenerateIntelligentSalarySlipLayoutOutput, GenerateIntelligentSalarySlipLayoutInput } from '@/ai/flows/generate-intelligent-salary-slip-layout';
import { cn } from '@/lib/utils';

interface SlipRendererProps {
  layout: GenerateIntelligentSalarySlipLayoutOutput;
  data: GenerateIntelligentSalarySlipLayoutInput;
}

export default function SlipRenderer({ layout, data }: SlipRendererProps) {
  const formatValue = (value: any, type: 'text' | 'amount' | 'date') => {
    if (value === null || value === undefined) return "";
    if (type === 'amount') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
    }
    if (type === 'date') {
      return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return String(value);
  };

  return (
    <div className="bg-white p-12 md:p-20 min-h-[800px] flex flex-col print-container text-[#1a1a1a] font-serif leading-relaxed">
      {layout.sections.map((section, sIdx) => (
        <div 
          key={sIdx} 
          className={cn(
            "mb-8", 
            section.layoutHint === "two columns" ? "flex justify-between items-center" : 
            section.layoutHint === "bottom-auth" ? "flex justify-between items-end mt-auto pt-12" :
            section.layoutHint === "right-align" ? "flex justify-end" : "flex flex-col gap-4"
          )}
        >
          {section.title && (
            <h2 className="text-2xl font-bold text-center mb-6 tracking-tight uppercase border-b-2 border-black pb-2 self-center">
              {section.title}
            </h2>
          )}
          
          <div className={cn(
            "w-full",
            section.layoutHint === "two columns" ? "flex justify-between w-full" : 
            section.layoutHint === "bottom-auth" ? "flex justify-between w-full" : "space-y-4"
          )}>
            {section.elements.map((element, eIdx) => {
              // Handle Paragraph elements
              if ("type" in element && element.type === "paragraph") {
                return (
                  <p key={eIdx} className="text-lg leading-[1.8] text-justify mb-4 indent-8 first:mt-4">
                    {element.content}
                  </p>
                );
              }

              // Handle Image elements
              if ("type" in element && element.type === "image") {
                const imgData = data[element.key as keyof GenerateIntelligentSalarySlipLayoutInput];
                if (!imgData) {
                   return (
                    <div key={eIdx} className="flex flex-col items-center justify-center border-t border-black pt-2 min-w-[150px]">
                      <div className="h-16 w-32 border border-dashed border-gray-300 mb-2 flex items-center justify-center text-[10px] text-gray-400">
                        {element.label} Space
                      </div>
                      <span className="text-sm font-bold uppercase">{element.label}</span>
                    </div>
                  );
                }
                return (
                  <div key={eIdx} className="flex flex-col items-center min-w-[150px]">
                    <div className="relative h-24 w-40 mb-2">
                      <img src={imgData as string} alt={element.label || "Image"} className="h-full w-full object-contain" />
                    </div>
                    <div className="w-full border-t border-black pt-1 text-center">
                      <span className="text-sm font-bold uppercase">{element.label}</span>
                    </div>
                  </div>
                );
              }

              // Handle Field elements
              if ("type" in element && (element.type === 'text' || element.type === 'amount' || element.type === 'date')) {
                // Special case for Period mapping if it's not a direct key
                let value = data[element.key as keyof GenerateIntelligentSalarySlipLayoutInput];
                if (element.key === 'period') {
                  value = `${formatValue(data.paymentPeriodStart, 'date')} to ${formatValue(data.paymentPeriodEnd, 'date')}`;
                }

                return (
                  <div key={eIdx} className={cn(
                    "flex items-baseline gap-2",
                    element.alignment === 'right' ? 'justify-end' : 'justify-start'
                  )}>
                    <span className="text-lg font-bold whitespace-nowrap">{element.label}:</span>
                    <span className={cn(
                      "text-lg",
                      element.emphasize ? "font-bold border-b border-black px-2" : "font-normal px-2 border-b border-dotted border-gray-400"
                    )}>
                      {element.type === 'text' && element.key === 'period' ? value : formatValue(value, element.type)}
                    </span>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      ))}
      
      {/* Visual Line at the very bottom for receipt feel */}
      <div className="mt-8 border-t border-black/10 pt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest no-print">
        Official Receipt - DrivePay System Generated
      </div>
    </div>
  );
}
