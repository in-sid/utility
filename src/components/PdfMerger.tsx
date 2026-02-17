
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileStack, 
  Plus, 
  Trash2, 
  FileText, 
  Printer, 
  Loader2,
  FileUp
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function PdfMerger() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  // Cleanup blob URL when component unmounts or mergedPdfUrl changes
  useEffect(() => {
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, [mergedPdfUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      // Reset merged PDF if files are added
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
        setMergedPdfUrl(null);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least 2 PDF files to merge.",
      });
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setMergedPdfUrl(url);
      setActiveTab("preview");
      toast({
        title: "Success",
        description: "PDFs merged successfully.",
      });
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast({
        variant: "destructive",
        title: "Merge Failed",
        description: "An error occurred while merging the PDF files.",
      });
    } finally {
      setIsMerging(false);
    }
  };

  const handlePrint = () => {
    if (mergedPdfUrl) {
      const printWindow = window.open(mergedPdfUrl, '_blank');
      if (printWindow) {
        printWindow.print();
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-8 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Merge PDF Documents</h2>
          <p className="text-muted-foreground text-sm">Upload multiple PDFs to combine them into a single printable document.</p>
        </div>
        <div className="flex gap-2">
          {mergedPdfUrl && activeTab === "preview" && (
            <Button onClick={handlePrint} variant="default" className="gap-2 shadow-sm rounded-xl">
              <Printer className="h-4 w-4" />
              Print / Save Merged PDF
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-2xl h-14 no-print">
          <TabsTrigger value="input" className="rounded-xl flex gap-2 h-full text-base">
            <FileUp className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!mergedPdfUrl} className="rounded-xl flex gap-2 h-full text-base">
            <FileText className="h-4 w-4" />
            Merged Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="no-print">
          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileStack className="h-5 w-5 text-primary" />
                Select PDF Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 hover:bg-muted/50 transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={onFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileUp className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                <p className="text-sm font-medium">Click or drag PDF files here to upload</p>
                <p className="text-xs text-muted-foreground mt-1">Accepts multiple .pdf files</p>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Selected Files ({files.length})</Label>
                  <div className="grid gap-2">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm font-medium truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={mergePdfs} 
                className="w-full h-14 rounded-xl text-lg shadow-lg" 
                disabled={files.length < 2 || isMerging}
              >
                {isMerging ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Merging Documents...
                  </>
                ) : (
                  "Merge PDFs & Preview"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="w-full">
          {mergedPdfUrl ? (
            <div className="w-full h-[800px] border rounded-2xl overflow-hidden bg-white shadow-inner">
              <iframe
                src={`${mergedPdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full"
                title="Merged PDF Preview"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed rounded-2xl">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No Merged Document</p>
              <p className="text-muted-foreground">Upload and merge files first to see the preview.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
