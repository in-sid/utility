
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
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDYiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAxMDYgMzIiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMC43IDE2LjljMCA1LjMtMy4zIDYuOC03LjUgNi44LTQuMyAwLTcuNC0xLjctNy40LTYuNiAwLTUuMSAzLjEtNi44IDcuNC02LjggNC4zIDAgNy41IDEuNiA3LjUgNi42em0tOS4xLTQuMWMwIDIuMy44IDQuMSAyLjkgNC4xIDEuOSAwIDIuOC0xLjggMi44LTQuMSAwLTIuNC0uOS00LjItMi44LTQuMi0yLjEgMC0yLjkgMS44LTIuOSA0LjJ6bTguMS0yLjVjMC01LjEtMy4xLTYuOC03LjQtNi44LTQuMyAwLTcuNSAxLjYtNy41IDYuNyAwIDUuMSAzLjIgNi44IDcuNSA2LjggNC4zIDAgNy40LTEuNyA3LjQtNi44aC0zLjRjMCAzLjEgMS4yIDQuMiAyLjkgNC4yIDEuOSAwIDIuNi0xLjMgMi42LTMuMiAwLTQuMi01LjgtMy45LTUuOC01LjggMC0xIDEuMS0xLjUgMi4yLTEuNSAxLjQgMCAyLjEgLjcgMi4xIDIuMWgzLjR6bTQuMSAxMi45VjEuOWgzLjV2MjQuNmgtMy41em0xMS41LTIuN2MwLTUtMy4xLTYuOC03LjQtNi44cy03LjUgMS43LTcuNSA2LjhjMCA1IDMuMiA2LjggNy41IDYuOHM3LjQtMS43IDcuNC02Ljh6bS0zLjQgMGMwIDIuOS0xLjMgNC4yLTMuOSA0LjJzLTQtMS4zLTQtNC4yYzAtMi45IDEuMy00LjIgNC00LjJzMy45IDEuMyAzLjkgNC4yeiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01NC4zIDI2LjVWNy40aDMuOHYyMS43aC0zLjgtNS41ek03My40IDEyLjJjMC0yLjggMS41LTMuMyAzLjktMy4zIDEuMiAwIDEuOC4zIDEuOCAxLjZ2MS42aC0zLjVWMTEuOWgxLjN2LS44YzAtLjgtLjYtMS0xLjItMS0xLjMgMC0yLjYgLjUtMi42IDIuN3YxLjZoNS42di01LjZoLTUuNnYtMS4yYzAtLjktLjktMS41LTEuOS0xLjUtLjYgMC0uOS4yLS45LjVoMS45VjQuOUg3MHYyLjdoLTEuN1YxOWgzLjVWMTIuMnoiLz48cGF0aCBmaWxsPSIjRkY5OTAwIiBkPSJNMTA1LjIgMTQuMmMwLTIuNy0uMy03LjEtMS04LjgtMS4xLTIuOC0zLjktNC02LjgtNC41LTQgLjgtNy4xIDIuNi04LjggNC45Qzg3IDEwLjQgODYgMTcgODYgMTdoOS45YzAgLTIuNS4yLTYuMi42LTYuOC40LS41IDEuMS0uNSAxLjYtLjVzMS4xIDAgMS40LjVjLjQuNi41IDMuNy42IDYuOEgxMDV6Ii8+PC9zdmc+" alt="Amazon Logo" className="w-24 h-auto" />
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
