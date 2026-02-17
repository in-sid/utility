
"use client";

import React from 'react';
import { BookBillInput } from '@/lib/book-bill-types';
import { format, parseISO } from 'date-fns';
import { Package } from "lucide-react";

interface BookBillRendererProps {
  data: BookBillInput;
}

export default function BookBillRenderer({ data }: BookBillRendererProps) {
  const subtotal = data.items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + data.summary.shipping;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  const currencyFormat = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num).replace('₹', '₹');
  };

  return (
    <div className="bg-[#f3f3f3] p-4 md:p-8 min-h-screen font-body print:bg-white print:p-0">
      <div className="max-w-[900px] mx-auto bg-white border border-gray-200 shadow-sm print:shadow-none print:border-none">
        {/* Main Content Area */}
        <div className="p-8">
          <h1 className="text-[28px] font-normal text-[#111] mb-2">Order Summary</h1>
          <div className="text-[13px] text-[#565959] flex items-center gap-2 mb-6">
            <span>Order placed {formatDate(data.orderDate)}</span>
            <span className="text-gray-300">|</span>
            <span>Order number {data.orderNumber}</span>
          </div>

          {/* Details Table */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ship To */}
            <div className="space-y-1">
              <h3 className="text-[14px] font-bold mb-2">Ship to</h3>
              <div className="text-[13px] text-[#111]">
                <p className="font-medium">{data.shipTo.name}</p>
                <p>{data.shipTo.addressLine1}</p>
                <p>{data.shipTo.addressLine2}</p>
                <p>{data.shipTo.city}</p>
                <p>{data.shipTo.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <h3 className="text-[14px] font-bold mb-2">Payment method</h3>
              <div className="text-[13px] text-[#111]">
                <p>{data.paymentMethod.cardType} ending in {data.paymentMethod.lastFour}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-1">
              <h3 className="text-[14px] font-bold mb-2">Order Summary</h3>
              <div className="text-[13px] space-y-1">
                <div className="flex justify-between">
                  <span>Item(s) Subtotal:</span>
                  <span>{currencyFormat(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{currencyFormat(data.summary.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t mt-1">
                  <span>Grand Total:</span>
                  <span>{currencyFormat(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {data.items.map((item, i) => (
              <div key={i} className="flex p-6 gap-6 border-b last:border-b-0 border-gray-100">
                <div className="w-20 h-24 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100">
                  <Package className="text-gray-300 h-8 w-8" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[14px] font-medium text-[#007185] hover:text-[#c7511f] cursor-pointer">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-[#565959]">
                    Sold by: <span className="text-[#007185]">{item.seller}</span>
                  </p>
                  <p className="text-[13px] font-bold mt-2">
                    {currencyFormat(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amazon-style Footer */}
        <div className="no-print mt-8">
          <div className="bg-[#37475a] hover:bg-[#485769] text-white text-[13px] py-3 text-center cursor-pointer font-medium">
            Back to top
          </div>
          <div className="bg-[#232f3e] py-12 flex flex-col items-center gap-8">
            <img src="data:image/png;base64,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" alt="Amazon Logo" className="w-24 h-auto" />
            <div className="flex gap-6 text-[12px] text-gray-300">
              <span>Conditions of Use & Sale</span>
              <span>Privacy Notice</span>
              <span>Interest-Based Ads</span>
            </div>
            <p className="text-[12px] text-gray-400">
              © 1996-2025, Amazon.com, Inc. or its affiliates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
