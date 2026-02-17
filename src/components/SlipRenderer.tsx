"use client";

import React, { useState, useEffect } from 'react';
import { SalarySlipLayout, SalarySlipInput } from '@/lib/salary-types';
import { cn } from '@/lib/utils';

interface SlipRendererProps {
  layout: SalarySlipLayout;
  data: SalarySlipInput;
}

export default function SlipRenderer({ layout, data }: SlipRendererProps) {
  const [sigRotation, setSigRotation] = useState(0);
  const [stampRotation, setStampRotation] = useState(0);

  useEffect(() => {
    // Random rotation between -5 and +5 degrees
    setSigRotation(Math.floor(Math.random() * 11) - 5);
    setStampRotation(Math.floor(Math.random() * 11) - 5);
  }, [data]);

  const formatValue = (value: any, type: string) => {
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
    <div className="bg-white p-12 md:p-20 min-h-[800px] flex flex-col print-container text-[#1a1a1a] font-serif leading-relaxed border-8 border-double border-gray-200 relative overflow-hidden">
      {layout.sections.map((section, sIdx) => (
        <div 
          key={sIdx} 
          className={cn(
            "mb-8", 
            section.layoutHint === "two columns" ? "flex justify-between items-center" : 
            section.layoutHint === "bottom-auth" ? "relative mt-auto pt-24 min-h-[160px]" :
            section.layoutHint === "right-align" ? "flex justify-end" : "flex flex-col gap-4"
          )}
        >
          {section.title && (
            <h2 className="text-3xl font-bold text-center mb-10 tracking-tight uppercase border-b-2 border-black pb-4 self-center w-fit px-8">
              {section.title}
            </h2>
          )}
          
          <div className={cn(
            "w-full",
            section.layoutHint === "two columns" ? "flex justify-between w-full" : 
            section.layoutHint === "bottom-auth" ? "flex justify-between items-end w-full" : "space-y-6"
          )}>
            {section.elements.map((element, eIdx) => {
              // Paragraph
              if (element.type === "paragraph") {
                return (
                  <p key={eIdx} className="text-xl leading-[2] text-justify mb-6 indent-12">
                    {element.content}
                  </p>
                );
              }

              // Image
              if (element.type === "image") {
                const imgData = data[element.key as keyof SalarySlipInput];
                
                // Special handling for signature overlapping stamp in the bottom-auth section
                if (section.layoutHint === "bottom-auth") {
                   if (element.key === 'stampDataUri') {
                      return (
                        <div key={eIdx} className="relative flex flex-col items-center min-w-[180px]">
                           <div className="h-28 w-28 flex items-center justify-center">
                              {imgData ? (
                                <img 
                                  src={imgData as string} 
                                  alt="Stamp" 
                                  className="h-full w-full object-contain"
                                  style={{ transform: `rotate(${stampRotation}deg)` }}
                                />
                              ) : (
                                <div className="h-24 w-24 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                                  STAMP
                                </div>
                              )}
                           </div>
                           <div className="w-full border-t border-black pt-1 text-center mt-2">
                             <span className="text-sm font-bold uppercase">Revenue Stamp</span>
                           </div>
                        </div>
                      );
                   }
                   if (element.key === 'signatureDataUri') {
                      return (
                        <div key={eIdx} className="absolute right-0 bottom-0 flex flex-col items-center min-w-[200px]">
                            <div className="relative h-32 w-48 -mb-12 z-10 pointer-events-none">
                               {imgData && (
                                 <img 
                                   src={imgData as string} 
                                   alt="Signature" 
                                   className="h-full w-full object-contain opacity-90"
                                   style={{ transform: `rotate(${sigRotation}deg)` }}
                                 />
                               )}
                            </div>
                            <div className="w-full border-t border-black pt-1 text-center">
                              <span className="text-sm font-bold uppercase">Signature</span>
                            </div>
                        </div>
                      );
                   }
                }

                if (!imgData) {
                   return (
                    <div key={eIdx} className="flex flex-col items-center justify-center border-t border-black pt-2 min-w-[200px]">
                      <div className="h-20 w-40 border border-dashed border-gray-300 mb-2 flex items-center justify-center text-[10px] text-gray-400">
                        {element.label} Space
                      </div>
                      <span className="text-sm font-bold uppercase">{element.label}</span>
                    </div>
                  );
                }
                return (
                  <div key={eIdx} className="flex flex-col items-center min-w-[200px]">
                    <div className="relative h-28 w-48 mb-2">
                      <img src={imgData as string} alt={element.label || "Image"} className="h-full w-full object-contain" />
                    </div>
                    <div className="w-full border-t border-black pt-1 text-center">
                      <span className="text-sm font-bold uppercase">{element.label}</span>
                    </div>
                  </div>
                );
              }

              // Field
              if (element.type === 'text' || element.type === 'amount' || element.type === 'date') {
                let value = data[element.key as keyof SalarySlipInput];
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
                      "text-lg min-w-[100px]",
                      element.emphasize ? "font-bold border-b-2 border-black px-2" : "font-normal px-2 border-b border-dotted border-gray-400"
                    )}>
                      {formatValue(value, element.type)}
                    </span>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-auto border-t border-black/10 pt-8 text-[12px] text-gray-400 text-center uppercase tracking-[0.3em] no-print">
        Official Document - DrivePay System Generated
      </div>
    </div>
  );
}