"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calculator, FileText, Settings, UserCircle, Car, DollarSign } from "lucide-react";
import SalaryForm from './SalaryForm';
import SlipRenderer from './SlipRenderer';
import { GenerateIntelligentSalarySlipLayoutInput, GenerateIntelligentSalarySlipLayoutOutput, generateIntelligentSalarySlipLayout } from '@/ai/flows/generate-intelligent-salary-slip-layout';
import { useToast } from '@/hooks/use-toast';

export default function DrivePayApp() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [layoutData, setLayoutData] = useState<GenerateIntelligentSalarySlipLayoutOutput | null>(null);
  const [formData, setFormData] = useState<GenerateIntelligentSalarySlipLayoutInput | null>(null);
  const [activeTab, setActiveTab] = useState("input");

  const handleGenerate = async (data: GenerateIntelligentSalarySlipLayoutInput) => {
    setIsGenerating(true);
    setFormData(data);
    try {
      const result = await generateIntelligentSalarySlipLayout(data);
      setLayoutData(result);
      setActiveTab("preview");
      toast({
        title: "Success",
        description: "Salary slip generated successfully!",
      });
    } catch (error) {
      console.error("Failed to generate layout:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate salary slip layout. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
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
            <p className="text-muted-foreground text-sm">Professional Salary Slips for Drivers</p>
          </div>
        </div>
        <div className="flex gap-2">
          {layoutData && (
            <Button onClick={handleDownload} variant="secondary" className="gap-2 shadow-sm">
              <Download className="h-4 w-4" />
              Download Slip
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full no-print">
        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-2xl h-14">
          <TabsTrigger value="input" className="rounded-xl flex gap-2 h-full text-base">
            <Calculator className="h-4 w-4" />
            Input Information
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!layoutData} className="rounded-xl flex gap-2 h-full text-base">
            <FileText className="h-4 w-4" />
            Slip Preview
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
        <p>&copy; {new Date().getFullYear()} DrivePay. Built for reliability and trust.</p>
      </footer>
    </div>
  );
}