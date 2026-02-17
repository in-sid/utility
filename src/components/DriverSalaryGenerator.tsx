"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Printer } from "lucide-react";
import SalaryForm from './SalaryForm';
import SlipRenderer from './SlipRenderer';
import { SalarySlipInput } from '@/lib/salary-types';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_STAMP = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI0Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2RjMjYyNiI+UkVWRU5VRTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjZGMyNjI2Ij5TVEFNUDwvdGV4dD48L3N2Zz4=";
const DEFAULT_SIGNATURE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIj48dGV4dCB4PSIxMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSInQnJ1c2ggU2NyaXB0IE1UJywgY3Vyc2l2ZSIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzI1NjNlYiI+Sm9obiBEb2U8L3RleHQ+PC9zdmc+";

const DEFAULT_FORM_DATA: SalarySlipInput = {
  companyName: "",
  companyAddress: "",
  employerName: "",
  billDate: "2025-04-01",
  period: 'Quarterly',
  paymentPeriodStart: "2025-04-01",
  paymentPeriodEnd: "2026-03-31",
  startDateFY: "2025-04-01",
  billNumber: null,
  driverName: "",
  vehicleNumber: "",
  salaryBreakdown: [
    { item: "Basic Salary", amount: 0 },
  ],
  totalSalary: 0,
  signatureDataUri: DEFAULT_SIGNATURE,
  stampDataUri: DEFAULT_STAMP,
};

export default function DriverSalaryGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<SalarySlipInput>(DEFAULT_FORM_DATA);
  const [activeTab, setActiveTab] = useState("input");
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  const handleUpdateData = (data: SalarySlipInput) => {
    setFormData(data);
  };

  const handleGenerate = async (data: SalarySlipInput) => {
    setIsGenerating(true);
    setFormData(data);
    
    setTimeout(() => {
      setHasGeneratedOnce(true);
      setActiveTab("preview");
      toast({
        title: "Success",
        description: "Receipts generated for preview.",
      });
      setIsGenerating(false);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-8 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Driver Salary Receipts</h2>
          <p className="text-muted-foreground text-sm">Create and manage professional salary slips for your driver.</p>
        </div>
        <div className="flex gap-2">
          {hasGeneratedOnce && (activeTab === "preview") && (
            <Button onClick={handlePrint} variant="default" className="gap-2 shadow-sm rounded-xl">
              <Printer className="h-4 w-4" />
              Print / Save as PDF
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-2xl h-14 no-print">
          <TabsTrigger value="input" className="rounded-xl flex gap-2 h-full text-base">
            <Calculator className="h-4 w-4" />
            Receipt Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!hasGeneratedOnce} className="rounded-xl flex gap-2 h-full text-base">
            <FileText className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="no-print">
          <SalaryForm 
            initialData={formData} 
            onGenerate={handleGenerate} 
            onChange={handleUpdateData}
            isGenerating={isGenerating} 
          />
        </TabsContent>

        <TabsContent value="preview" className="print:block">
          {hasGeneratedOnce && (
            <div className="print:p-0">
              <SlipRenderer data={formData} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}