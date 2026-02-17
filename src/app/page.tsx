
"use client";

import React, { useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, BookOpen, FileStack, ArrowRight } from "lucide-react";
import DriverSalaryGenerator from "@/components/DriverSalaryGenerator";
import BookBillGenerator from "@/components/BookBillGenerator";
import PdfMerger from "@/components/PdfMerger";

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const tools = [
    {
      id: "driver-salary",
      title: "Driver Salary",
      description: "Create professional monthly or quarterly salary receipts for drivers with automatic calculations.",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      id: "book-bills",
      title: "Book Bills",
      description: "Generate Amazon-style order summaries for book purchases with multiple line items.",
      icon: BookOpen,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      id: "merge-pdf",
      title: "Merge PDF",
      description: "Combine multiple PDF documents into a single file for easier printing and sharing.",
      icon: FileStack,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tools.map((tool) => (
              <Card 
                key={tool.id} 
                className="group cursor-pointer hover:shadow-lg transition-all border-none bg-card/60 backdrop-blur-sm overflow-hidden"
                onClick={() => setActiveSection(tool.id)}
              >
                <CardHeader className={`${tool.bg} transition-colors group-hover:bg-opacity-20`}>
                  <div className="flex items-center justify-between">
                    <tool.icon className={`h-8 w-8 ${tool.color}`} />
                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <CardTitle className="mt-4">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        );
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
      case "dashboard": return "Dashboard";
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
          {activeSection === "dashboard" && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground">Select a tool below to get started with your document generation.</p>
            </div>
          )}
          {renderContent()}
        </main>
      </SidebarInset>
    </div>
  );
}
