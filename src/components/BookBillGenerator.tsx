
"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Printer } from "lucide-react";
import BookBillForm from './BookBillForm';
import BookBillRenderer from './BookBillRenderer';
import { BookBillInput } from '@/lib/book-bill-types';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_FORM_DATA: BookBillInput = {
  orderDate: new Date().toISOString().split('T')[0],
  orderNumber: "407-8065661-1841950",
  shipTo: {
    name: "Siddharth Saxena",
    addressLine1: "N 901, Great Value Sharanam",
    addressLine2: "Sector 107",
    city: "NOIDA",
    state: "UTTAR PRADESH",
    zipCode: "201301",
    country: "India"
  },
  paymentMethod: {
    cardType: "Amazon Pay ICICI Bank Credit Card",
    lastFour: "4001"
  },
  summary: {
    subtotal: 0,
    shipping: 60
  },
  items: [
    { title: "Winsar Uttarakhand Year Book 2024", seller: "Uttarakhand Boxx Center", price: 270 }
  ]
};

export default function BookBillGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<BookBillInput>(DEFAULT_FORM_DATA);
  const [activeTab, setActiveTab] = useState("input");
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  const handleUpdateData = (data: BookBillInput) => {
    setFormData(data);
  };

  const handleGenerate = async (data: BookBillInput) => {
    setIsGenerating(true);
    setFormData(data);
    
    setTimeout(() => {
      setHasGeneratedOnce(true);
      setActiveTab("preview");
      toast({
        title: "Success",
        description: "Book bill generated for preview.",
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
          <h2 className="text-2xl font-bold tracking-tight">Book Order Summaries</h2>
          <p className="text-muted-foreground text-sm">Generate professional book purchase receipts in Amazon style.</p>
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
            Order Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!hasGeneratedOnce} className="rounded-xl flex gap-2 h-full text-base">
            <FileText className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="no-print">
          <BookBillForm 
            initialData={formData} 
            onGenerate={handleGenerate} 
            onChange={handleUpdateData}
            isGenerating={isGenerating} 
          />
        </TabsContent>

        <TabsContent value="preview" className="print:block">
          {hasGeneratedOnce && (
            <div className="print:p-0">
              <BookBillRenderer data={formData} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
