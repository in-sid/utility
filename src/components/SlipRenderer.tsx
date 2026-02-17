"use client";

import React from 'react';
import { GenerateIntelligentSalarySlipLayoutOutput, GenerateIntelligentSalarySlipLayoutInput } from '@/ai/flows/generate-intelligent-salary-slip-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="bg-white p-12 md:p-16 min-h-[600px] flex flex-col print-container text-[#1a1a1a] font-sans">
      {layout.sections.map((section, sIdx) => (
        <div key={sIdx} className={cn("mb-6", section.layoutHint === "two columns" ? "grid grid-cols-2 gap-8" : "flex flex-col gap-3")}>
          {section.title && (
            <h2 className="text-xl font-bold text-center mb-4 tracking-tight">
              {section.title}
            </h2>
          )}
          
          <div className={cn(
            "w-full",
            section.layoutHint === "inline" ? "flex flex-wrap gap-x-12 gap-y-2" : "space-y-3"
          )}>
            {section.elements.map((element, eIdx) => {
              // Handle Paragraph elements
              if ("type" in element && element.type === "paragraph") {
                return (
                  <p key={eIdx} className="text-lg leading-relaxed text-justify mb-4">
                    {element.content}
                  </p>
                );
              }

              // Handle Image elements
              if ("type" in element && element.type === "image") {
                const imgData = data[element.key as keyof GenerateIntelligentSalarySlipLayoutInput];
                if (!imgData) return null;
                return (
                  <div key={eIdx} className={cn("flex flex-col relative", element.positionHint === "bottom-right" ? "items-end mt-4" : "mt-2")}>
                    {element.label && <span className="text-sm font-semibold mb-1">{element.label}:</span>}
                    <div className="relative h-20 w-40">
                      <img src={imgData as string} alt={element.label || "Image"} className="h-full w-full object-contain" />
                    </div>
                  </div>
                );
              }

              // Handle Table elements
              if ("type" in element && element.type === "salaryBreakdownTable") {
                return (
                  <div key={eIdx} className="w-full mt-4">
                    {element.title && <h4 className="font-semibold mb-2">{element.title}</h4>}
                    <Table className="border border-black">
                      <TableHeader className="bg-gray-50">
                        <TableRow className="border-black">
                          {element.headers.map((h, i) => (
                            <TableHead key={i} className={cn("font-bold text-black border-r border-black last:border-0", i === 1 ? "text-right" : "")}>{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.salaryBreakdown.map((item, i) => (
                          <TableRow key={i} className="border-black">
                            <TableCell className="border-r border-black">{item.item}</TableCell>
                            <TableCell className="text-right font-mono border-black">{formatValue(item.amount, 'amount')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              }

              // Handle Field elements
              if ("type" in element && (element.type === 'text' || element.type === 'amount' || element.type === 'date')) {
                const value = data[element.key as keyof GenerateIntelligentSalarySlipLayoutInput];
                return (
                  <div key={eIdx} className={cn(
                    "flex items-baseline gap-2",
                    element.alignment === 'center' ? 'justify-center w-full' :
                    element.alignment === 'right' ? 'justify-end w-full' : 'justify-start'
                  )}>
                    <span className="text-base font-bold whitespace-nowrap">{element.label}:</span>
                    <span className={cn(
                      "text-base",
                      element.emphasize ? "font-bold" : "font-normal"
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
    </div>
  );
}