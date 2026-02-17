"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Upload, Calendar, Building, CreditCard, User, Stamp as StampIcon, PenTool, Truck } from "lucide-react";
import { GenerateIntelligentSalarySlipLayoutInput } from '@/ai/flows/generate-intelligent-salary-slip-layout';

interface SalaryFormProps {
  onGenerate: (data: GenerateIntelligentSalarySlipLayoutInput) => void;
  isGenerating: boolean;
}

export default function SalaryForm({ onGenerate, isGenerating }: SalaryFormProps) {
  const [companyName, setCompanyName] = useState("Skyline Logistics Ltd.");
  const [companyAddress, setCompanyAddress] = useState("123 Fleet Way, Transport Hub, TH1 5ST");
  const [employerName, setEmployerName] = useState("Siddharth Saxena");
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState<"Monthly" | "Quarterly" | "Custom">("Monthly");
  const [paymentPeriodStart, setPaymentPeriodStart] = useState("");
  const [paymentPeriodEnd, setPaymentPeriodEnd] = useState("");
  const [startDateFY, setStartDateFY] = useState("2024-04-01");
  const [billNumber, setBillNumber] = useState("");
  const [driverName, setDriverName] = useState("Avadesh Kumar");
  const [vehicleNumber, setVehicleNumber] = useState("HR26CZ0662");
  const [salaryBreakdown, setSalaryBreakdown] = useState<{ item: string; amount: number }[]>([
    { item: "Total Salary", amount: 24000 },
  ]);
  const [signatureDataUri, setSignatureDataUri] = useState<string | null>(null);
  const [stampDataUri, setStampDataUri] = useState<string | null>(null);

  const handleAddSalaryItem = () => {
    setSalaryBreakdown([...salaryBreakdown, { item: "", amount: 0 }]);
  };

  const handleRemoveSalaryItem = (index: number) => {
    setSalaryBreakdown(salaryBreakdown.filter((_, i) => i !== index));
  };

  const handleSalaryItemChange = (index: number, field: "item" | "amount", value: string | number) => {
    const updated = [...salaryBreakdown];
    if (field === "item") updated[index].item = value as string;
    if (field === "amount") updated[index].amount = Number(value);
    setSalaryBreakdown(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (uri: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSalary = salaryBreakdown.reduce((sum, item) => sum + item.amount, 0);
    onGenerate({
      companyName,
      companyAddress,
      employerName,
      billDate,
      period,
      paymentPeriodStart,
      paymentPeriodEnd,
      startDateFY,
      billNumber: billNumber || null,
      driverName,
      vehicleNumber,
      salaryBreakdown,
      totalSalary,
      signatureDataUri,
      stampDataUri,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Entity Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="employerName">Employer Name (Paid By)</Label>
              <Input id="employerName" value={employerName} onChange={(e) => setEmployerName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Billing Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billDate">Bill Date</Label>
                <Input id="billDate" type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period Type</Label>
                <Select value={period} onValueChange={(val) => setPeriod(val as any)}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentPeriodStart">Period Start</Label>
                <Input id="paymentPeriodStart" type="date" value={paymentPeriodStart} onChange={(e) => setPaymentPeriodStart(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentPeriodEnd">Period End</Label>
                <Input id="paymentPeriodEnd" type="date" value={paymentPeriodEnd} onChange={(e) => setPaymentPeriodEnd(e.target.value)} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Driver Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Full Name</Label>
              <Input id="driverName" placeholder="e.g. Avadesh Kumar" value={driverName} onChange={(e) => setDriverName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="vehicleNumber" className="pl-9" placeholder="e.g. HR26CZ0662" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Signature / Revenue Stamp (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSignatureDataUri)} className="hidden" id="signature-upload" />
                  <Label htmlFor="signature-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl p-4 h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                      {signatureDataUri ? (
                        <img src={signatureDataUri} alt="Signature" className="h-full object-contain" />
                      ) : (
                        <>
                          <PenTool className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] text-center text-muted-foreground leading-tight">Upload Signature</span>
                        </>
                      )}
                    </div>
                  </Label>
                </div>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setStampDataUri)} className="hidden" id="stamp-upload" />
                  <Label htmlFor="stamp-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl p-4 h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                      {stampDataUri ? (
                        <img src={stampDataUri} alt="Stamp" className="h-full object-contain" />
                      ) : (
                        <>
                          <StampIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-[10px] text-center text-muted-foreground leading-tight">Upload Stamp</span>
                        </>
                      )}
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Salary Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            {salaryBreakdown.map((item, index) => (
              <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-1">
                <div className="flex-1 space-y-2">
                  <Label>Item Description</Label>
                  <Input 
                    value={item.item} 
                    onChange={(e) => handleSalaryItemChange(index, "item", e.target.value)} 
                    placeholder="e.g. Basic Salary"
                    required
                  />
                </div>
                <div className="w-40 space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input 
                    type="number" 
                    value={item.amount} 
                    onChange={(e) => handleSalaryItemChange(index, "amount", e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveSalaryItem(index)}
                  disabled={salaryBreakdown.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full rounded-xl border-dashed" onClick={handleAddSalaryItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl">
            <span className="font-bold text-lg">Net Payable</span>
            <span className="font-bold text-2xl text-primary">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salaryBreakdown.reduce((sum, item) => sum + item.amount, 0))}
            </span>
          </div>

          <Button type="submit" className="w-full h-14 rounded-xl text-lg shadow-lg" disabled={isGenerating}>
            {isGenerating ? "Formatting Receipt..." : "Generate Official Receipt"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}