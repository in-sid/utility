
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ShoppingBag, Truck, CreditCard, Package } from "lucide-react";
import { BookBillInput } from '@/lib/book-bill-types';

interface BookBillFormProps {
  initialData: BookBillInput;
  onGenerate: (data: BookBillInput) => void;
  onChange: (data: BookBillInput) => void;
  isGenerating: boolean;
}

export default function BookBillForm({ initialData, onGenerate, onChange, isGenerating }: BookBillFormProps) {
  
  const updateField = (path: string, value: any) => {
    const newData = { ...initialData };
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(newData);
  };

  const handleAddItem = () => {
    const updated = [...initialData.items, { title: "", seller: "", price: 0 }];
    updateField('items', updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = initialData.items.filter((_, i) => i !== index);
    updateField('items', updated);
  };

  const handleItemChange = (index: number, field: keyof any, value: any) => {
    const updated = [...initialData.items];
    (updated[index] as any)[field] = value;
    updateField('items', updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(initialData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Order Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input type="date" value={initialData.orderDate} onChange={(e) => updateField('orderDate', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Order Number</Label>
                <Input value={initialData.orderNumber} onChange={(e) => updateField('orderNumber', e.target.value)} required placeholder="e.g. 407-8065661-1841950" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method (e.g. Amazon Pay ICICI Bank Credit Card)</Label>
              <Input value={initialData.paymentMethod.cardType} onChange={(e) => updateField('paymentMethod.cardType', e.target.value)} required placeholder="Enter card description" />
            </div>
            <div className="space-y-2">
              <Label>Last 4 Digits</Label>
              <Input maxLength={4} value={initialData.paymentMethod.lastFour} onChange={(e) => updateField('paymentMethod.lastFour', e.target.value)} required placeholder="4001" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Recipient Name</Label>
              <Input value={initialData.shipTo.name} onChange={(e) => updateField('shipTo.name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input value={initialData.shipTo.addressLine1} onChange={(e) => updateField('shipTo.addressLine1', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2 (City, State, Zip)</Label>
              <Input value={initialData.shipTo.addressLine2} onChange={(e) => updateField('shipTo.addressLine2', e.target.value)} required placeholder="e.g. Sector 107, NOIDA, UP 201301" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Items & Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {initialData.items.map((item, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-xl relative group">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => handleRemoveItem(index)}
                  disabled={initialData.items.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Book Title</Label>
                    <Input value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Sold By</Label>
                    <Input value={item.seller} onChange={(e) => handleItemChange(index, 'seller', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Item Price (₹)</Label>
                    <Input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} required />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full border-dashed rounded-xl" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" /> Add Another Item
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shipping Cost (₹)</Label>
              <Input type="number" value={initialData.summary.shipping} onChange={(e) => updateField('summary.shipping', Number(e.target.value))} required />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-xl text-lg shadow-lg" disabled={isGenerating}>
            {isGenerating ? "Processing..." : "Generate Book Bill Preview"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
