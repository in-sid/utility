
"use client";

import React, { useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import DriverSalaryGenerator from "@/components/DriverSalaryGenerator";
import BookBillGenerator from "@/components/BookBillGenerator";
import PdfMerger from "@/components/PdfMerger";

export default function Home() {
  const [activeSection, setActiveSection] = useState("driver-salary");

  const renderContent = () => {
    switch (activeSection) {
      case "driver-salary":
        return <DriverSalaryGenerator />;
      case "book-bills":
        return <BookBillGenerator />;
      case "merge-pdf":
        return <PdfMerger />;
      default:
        return <DriverSalaryGenerator />;
    }
  };

  const getTitle = () => {
    switch (activeSection) {
      case "driver-salary": return "Driver Salary";
      case "book-bills": return "Book Bills";
      case "merge-pdf": return "Merge PDF";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar activeSection={activeSection} onSelect={setActiveSection} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 no-print">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {getTitle()}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {renderContent()}
        </main>
      </SidebarInset>
    </div>
  );
}
