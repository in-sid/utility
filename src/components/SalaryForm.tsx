"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Calendar, Building, CreditCard, User, Stamp as StampIcon, PenTool, Truck } from "lucide-react";
import { SalarySlipInput, SalaryItem } from '@/lib/salary-types';

interface SalaryFormProps {
  initialData: SalarySlipInput;
  onGenerate: (data: SalarySlipInput) => void;
  onChange: (data: SalarySlipInput) => void;
  isGenerating: boolean;
}

export default function SalaryForm({ initialData, onGenerate, onChange, isGenerating }: SalaryFormProps) {
  
  const updateField = (field: keyof SalarySlipInput, value: any) => {
    onChange({ ...initialData, [field]: value });
  };

  const handleAddSalaryItem = () => {
    const updated = [...initialData.salaryBreakdown, { item: "", amount: 0 }];
    updateField('salaryBreakdown', updated);
  };

  const handleRemoveSalaryItem = (index: number) => {
    const updated = initialData.salaryBreakdown.filter((_, i) => i !== index);
    updateField('salaryBreakdown', updated);
  };

  const handleSalaryItemChange = (index: number, field: "item" | "amount", value: string | number) => {
    const updated = [...initialData.salaryBreakdown];
    if (field === "item") updated[index].item = value as string;
    if (field === "amount") updated[index].amount = Number(value);
    updateField('salaryBreakdown', updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'signatureDataUri' | 'stampDataUri') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSalary = initialData.salaryBreakdown.reduce((sum, item) => sum + item.amount, 0);
    onGenerate({
      ...initialData,
      totalSalary,
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
              <Input id="employerName" value={initialData.employerName} onChange={(e) => updateField('employerName', e.target.value)} required placeholder="Enter employer name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input id="companyName" value={initialData.companyName} onChange={(e) => updateField('companyName', e.target.value)} placeholder="Enter company name" />
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
                <Label htmlFor="period">Period Type</Label>
                <Select value={initialData.period} onValueChange={(val) => updateField('period', val as any)}>
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
              <div className="space-y-2">
                <Label htmlFor="startDateFY">FY Start Date</Label>
                <Input id="startDateFY" type="date" value={initialData.startDateFY} onChange={(e) => updateField('startDateFY', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentPeriodStart">Period Start</Label>
                <Input id="paymentPeriodStart" type="date" value={initialData.paymentPeriodStart} onChange={(e) => updateField('paymentPeriodStart', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentPeriodEnd">Period End</Label>
                <Input 
                  id="paymentPeriodEnd" 
                  type="date" 
                  value={initialData.paymentPeriodEnd} 
                  onChange={(e) => updateField('paymentPeriodEnd', e.target.value)} 
                  required 
                />
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
              <Input id="driverName" placeholder="e.g. Avadesh Kumar" value={initialData.driverName} onChange={(e) => updateField('driverName', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="vehicleNumber" className="pl-9" placeholder="e.g. HR26CZ0662" value={initialData.vehicleNumber} onChange={(e) => updateField('vehicleNumber', e.target.value)} required />
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
              <Label>Signature & Revenue Stamp</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'signatureDataUri')} className="hidden" id="signature-upload" />
                  <Label htmlFor="signature-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl p-4 h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                      {initialData.signatureDataUri ? (
                        <img src={initialData.signatureDataUri} alt="Signature" className="h-full object-contain" />
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
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'stampDataUri')} className="hidden" id="stamp-upload" />
                  <Label htmlFor="stamp-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl p-4 h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                      {initialData.stampDataUri ? (
                        <img src={initialData.stampDataUri} alt="Stamp" className="h-full object-contain" />
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
            {initialData.salaryBreakdown.map((item, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Item Description</Label>
                  <Input 
                    value={item.item} 
                    onChange={(e) => handleSalaryItemChange(index, "item", e.target.value)} 
                    placeholder="e.g. Basic Salary"
                    required
                  />
                </div>
                <div className="w-48 space-y-2">
                  <Label>Amount (₹ per month)</Label>
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
                  disabled={initialData.salaryBreakdown.length === 1}
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
            <div className="flex flex-col">
              <span className="font-bold text-lg">Total Monthly Rate</span>
              <span className="text-xs text-muted-foreground">This is the base monthly amount</span>
            </div>
            <span className="font-bold text-2xl text-primary">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(initialData.salaryBreakdown.reduce((sum, item) => sum + item.amount, 0))}
            </span>
          </div>

          <Button type="submit" className="w-full h-14 rounded-xl text-lg shadow-lg" disabled={isGenerating}>
            {isGenerating ? "Processing..." : "Generate Official Receipts"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}