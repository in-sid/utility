
"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calculator, FileText, Car } from "lucide-react";
import SalaryForm from './SalaryForm';
import SlipRenderer from './SlipRenderer';
import { SalarySlipInput, SalarySlipLayout } from '@/lib/salary-types';
import { useToast } from '@/hooks/use-toast';

// Static layout generator to fulfill the "No Gemini Key" requirement
const generateStaticLayout = (data: SalarySlipInput): SalarySlipLayout => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(data.totalSalary);

  const periodText = `${formatDate(data.paymentPeriodStart)} to ${formatDate(data.paymentPeriodEnd)}`;

  return {
    overallDesignGoal: "Professional Driver Salary Receipt following exact regulatory format.",
    sections: [
      {
        layoutHint: "right-align",
        elements: [
          {
            key: "billDate",
            label: "Date",
            type: "date",
            alignment: "right"
          }
        ]
      },
      {
        title: "Driver Salary Receipt",
        elements: [
          {
            type: "paragraph",
            content: `This is to certify that Mr./Ms. ${data.employerName} have paid ${formattedAmount} to driver Mr/Ms ${data.driverName} towards salary of the period ${periodText} (Acknowledged receipt enclosed). I also declare that the driver is exclusively utilized for official purpose only.`
          },
          {
            type: "paragraph",
            content: "Please reimburse the above amount. I further declare that what is stated above is correct and true."
          }
        ]
      },
      {
        layoutHint: "two columns",
        elements: [
          {
            key: "vehicleNumber",
            label: "Vehicle Number",
            type: "text",
            emphasize: true
          },
          {
            key: "period",
            label: "Period",
            type: "text",
            alignment: "right"
          }
        ]
      },
      {
        elements: [
          {
            key: "driverName",
            label: "Driver Name",
            type: "text",
            emphasize: true
          }
        ]
      },
      {
        layoutHint: "bottom-auth",
        elements: [
          {
            key: "stampDataUri",
            label: "Revenue Stamp",
            type: "image",
            positionHint: "bottom-left"
          },
          {
            key: "signatureDataUri",
            label: "Signature",
            type: "image",
            positionHint: "bottom-right"
          }
        ]
      }
    ]
  };
};

export default function DrivePayApp() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [layoutData, setLayoutData] = useState<SalarySlipLayout | null>(null);
  const [formData, setFormData] = useState<SalarySlipInput | null>(null);
  const [activeTab, setActiveTab] = useState("input");

  const handleGenerate = async (data: SalarySlipInput) => {
    setIsGenerating(true);
    setFormData(data);
    
    // Perform generation locally (No AI key required)
    setTimeout(() => {
      try {
        const result = generateStaticLayout(data);
        setLayoutData(result);
        setActiveTab("preview");
        toast({
          title: "Success",
          description: "Salary slip generated!",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate salary slip.",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <header className="flex items-center justify-between mb-8 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg">
            <Car className="text-primary-foreground h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">DrivePay</h1>
            <p className="text-muted-foreground text-sm">Official Driver Receipts</p>
          </div>
        </div>
        <div className="flex gap-2">
          {layoutData && (
            <Button onClick={handlePrint} variant="default" className="gap-2 shadow-sm rounded-xl">
              <Download className="h-4 w-4" />
              Print / Save as PDF
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full no-print">
        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-2xl h-14">
          <TabsTrigger value="input" className="rounded-xl flex gap-2 h-full text-base">
            <Calculator className="h-4 w-4" />
            Receipt Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!layoutData} className="rounded-xl flex gap-2 h-full text-base">
            <FileText className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <SalaryForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </TabsContent>

        <TabsContent value="preview">
          {layoutData && formData && (
            <Card className="rounded-2xl border-none shadow-xl overflow-hidden bg-white">
              <CardContent className="p-0">
                <SlipRenderer layout={layoutData} data={formData} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Print View Wrapper */}
      <div className="hidden print:block print-only">
        {layoutData && formData && (
          <SlipRenderer layout={layoutData} data={formData} />
        )}
      </div>

      <footer className="mt-12 text-center text-muted-foreground text-sm no-print">
        <p>&copy; {new Date().getFullYear()} DrivePay. Professional Utility for Drivers & Employers.</p>
      </footer>
    </div>
  );
}
