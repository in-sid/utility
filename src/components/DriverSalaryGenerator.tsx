"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Printer } from "lucide-react";
import SalaryForm from './SalaryForm';
import SlipRenderer from './SlipRenderer';
import { SalarySlipInput } from '@/lib/salary-types';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_STAMP = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI0Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2RjMjYyNiI+UkVWRU5VRTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjZGMyNjI2Ij5TVEFNUDwvdGV4dD48L3N2Zz4=";
const DEFAULT_SIGNATURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAawAAAEcCAYAAACbAoDZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTGKCBbOAAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjExAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAGNdRzso9yOwAATO5JREFUeF7t3XV4VNfWB+A17pm4e4IECe6uBYoXaIE6bkVLCxRroUCBQpEiLaXeW7m9vfd+1UvdDSpUcAjE3TOZzPy+P04yQ4ZkmEkmk0my3ueZJ7LP6Dlz9tl7r702EWOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGWEuwcEMqxo0DbP/PGGOMeYxdLychqE0m5AoTDn7xA1daDhDb/oMxxljDe+fjfEo/40/lBjH99KNtKWOMMeYxgKpbv7v+4haWA7iFxRhjjcA/osTye+41Le374huutBhjjHmW+x/7G95hhZYWVlxiIVdWDuAWFmOMuZnxagSV5CosfxdkyauVs5pxhcUYY26mUBCVl8iIiEgsNVPM0L9tN2E14AqLMcbc7Je0a5bfzRViWjimTbVyVjOusBhjzM1+erO15XeNXwmVGczVyhljjDEPYQ1pbzcgjQMuHMQtLMYYc7OgSIPwi4goKoZbV47iCosxxtxo/dvfQOZVREREap9S0qr5NOwo/qQYY8yNis5FUEmhlIiItHojtR33h+0mjDHGWONbu9Y6fqXRmnj8ygncwmKMMTdKSKj8RUQkUpbZlDJ7uMJijDE3Oif+VfgFREFtcmyLmR1cYTHGmBv9lVRIam8hStA/Ugi+YI7hCosxxtwo4+d4MhlFRERkLFTbFjM7uMJijDE30pUFk6FYSHYrzQ61LWZ2cIXFGGNuFN3KaPn9/BkhvJ05hissxhhzo6vyP4mISCQGaaLSbIuZHVxhMcaYG2WkSoiICGYRxXbPtC1mdnCFxRhjbnTmswgSiYX5wl5aPgU7gz8txhhzIy3pCWYhSrA0w9u2mNnBFRZjjLlRVGtrdgvDtZBqZcw+rrAYY8yNFD6FRJVBFxL/LNtiZgdXWIwx5kbplVGCpnIJBUWW2hYzO7jCYowxN8pL1ZBEZiIiIq2KJw47gyssxhhzI1FOIMEsnHoNGX62xcwOrrAYY8yNokNUZDYJYe2Gq8G2xcwOrrAYc5Htz13DoEHgFWSZXUExxZbf//pLqLiYY7jCYsxFnnvBTF9/V0FrDp3jSovVKl1ymYiIJDITebW7aFvM7OAKizEXuOOJL5Hyhz9VGKT080mur1jtMtMqowSNEorrkmdbzOzgCosxFzj3Rj8qylIREdHlP7X0+Adfca3FapSfpiGx1ExERGqZzLaY2cEVFmMuIPa3Zt3OStJSZjEvfc5qZs4MJFQGXRgzAmyLmR1cYTFWT3vevIisLGuDKjdZS9Gq8GrbMFYlNkJBgFBhlV3jKEFncIXFWD2JsoIp/aKX9R8gWjqmA4d/sRr5RQqpmYiI/hTWcmQO4gqLsXpSa0AlOcL4FRFR/MCkauWMXS9fIxwfUoWJvDufsS1mdnCFxZgdu5/PuGnwxH/P/0oikXWzYZ2CqpUzdj2TyEhERBUGCflFWOdksZvjCouxWvSddA07HpPRiHsv4amPTtVacX1xqKtlTEKuKSczCRFgjNXkwg8BJJYIx4hOobAtZnZwhcVYDXYdzcVfP2so44I3ffpqBO3bGGi7iUV0qPWkow8wkFd8SrVyxq5nSA0ks0k49apKOUrQGVxhMVaDILWO8q7piYioolxCF74NpQWbrtXYytKHWyd/arWgXQ+04oALVqtWMda5V8VXa78QYjfiCouxGvxddJlgrl7vpFy0BlZcr1iaQ0REUkUFiTQ8JsHsC4wtsPzOUYLO4QqLsRq8+x6RVC6sWUREJJGbSFxR83hDZrKSqDLVTp/brtgWM1aNUZ9KREQSmZnKNOm2xcwOrrAYq0HmqWiqKBdyvhER6QJKSJdYcwhy0k+hRJVLnvcIbGVbzFg1hRXCKsMmo5jienGF5QyusBirgdd141JERKZSBfUcau3KuZ6osudQoSknU4HWtpixakqLxCSpzCWo0dY4LMpqwRUWYzYeffFvFJZUWP4WiUFy7yJa3HNIjcEUwZXrG3mFFFG+ONu2mLFqStN9SKIQji9daYhtMbODKyzGbJiuRVH6WevS5TCLqP3AjGrbVFn32g+QaIQuHp2fgWRRPIbF7PM2BZOxVIgUNKZzlKAzuMJizAa0+WQslVr+likrqFOCEFhhq/RCFBVmCcEYxdkaknjn227CWDXxUTJLBCpHCTqHKyzGbFwpqT7x1zu8gKICNdX+V8WrIpDyU3VERJR7VUdrB4yusduQsSq+0bmW38+erVbEGGPO6TjuDKSKChABREDXsVduMjIubCfcGLNv9u6TluMlYcQFPmacwC0sxmzknmpFFQYhpF2pM1CId80ThomIVr38jeWE4xuZT0dfzecTELMrs6jEEiXoFVBmW8zs4AqrAU2Yk4z4ftfQ//5fMW3jKSzefhFPv53EJzQP53Ndl43a20iRvWtfLuTceTOpfYSTTnDrPDL7pdluwlg1pXlKUuqFY0YhqnlslDG3Gjn7PHwjCyBTlUMkMiMi0gyv4EJE97yGjS/8yZWWh9r73z/Qqm8KiACR2IzA6AK7+2rguGzIlEYQAZ1HXbW7LWNERBPnJEPjVwwiYOCtuXzMOIFbWC62//tPofUpx0fPxlFpgYwmTysnQCy6miQW9R9RTEVXguj5fb6050gRH6geqPhSGKVfFIIoRGKQb6z9eVUBcl8ylgkRhfnJ1606zFgt/CQBVJovtKyyL3vbFjPmHg/uP4fIhAIQAWqfUgybmn5DpTRzpjDYOnUqD9B7oicOCvuv6nbPHusYVU2WPiRcKRMBag3vU3Zzjz9uPb7EYjMfM07gFpaLHDlqxn9e1VPqJWGAPq5nBn38ZtANIc4JCcJPnn/hmZJl1jhjfVgB9QpoW63cVon/eaLK9EwKv+rpnBiriW+MkN2fiCigtf0WPGMut+fLz+Hlb7BcNbXuk4a9J360c+UEiER8Ne6J+s46aRmT6jT68k330fxnP7fs95g+HFDTFD20NQd7n3VfdOej735Z2bIC4gfe/BhjVtzCqqfH3/kJO2d1oYIsORERBUQV0dBJObRseI8bWlfX4+rKM6V93Y6MZVKSyE0UE2FdaK82l8/KSaU3EBGRzseaf5B5tiM/fYHRq39ATO+rOP6CiU584b7wcqOskHzDhfyTcjlo/3t/8NnAQVxh1dO/jgVSduV6SCoV0dDhZjq8up3dyqpdO+Hn49tMfKB6GO+AciIi0vqVUEioA7snK4TEUmHdLJnYms6Jea7tB/OwZ1EH+nB3N0r6OYR0GgkN6VvzWmcNIeO3cCKZUfjDqKQlY9rbPV80VzNWXcLyjdkOfMmsuMKqh2H3XMCfX/uToVi4Eu/Uiej1Y/qbHnw+EQUUnJBFRr+rtkWskRnlhUREpPc3UsLoc7bFN/BBIBmKhdZ1frLetph5oH+9IacLv2nJbBKT0stAA6ek0Mr53jf93rqKpiyITOXCqbcso2VGlk65pwDffCmjTHPNSaWZi42amQalV6ll/CI+3vFOvt7TziGiUzoefuUHh+/DGt7O59IR2DoLREBAkGPRW2vWWCO+vPSO3Yc1nrHjTJb9pfEtxeTHvnb7Ptu+y2AZJ5XJHD9vNAdbX7iAsMQ0qL3LMOSuiy3qvTeaxSvK4B9UARIJB76PD7Bxo+MHXrfbziAotgBPfHHC4fuwhnfgUOVJRFGBEfMcm9y992iR5QTII5OebctTufAOywcRoNIZMWXF+UbcXy3vmFnxaBZCI4wQiYC+Q0pw8MSvLea9N5r1L5xGaHz1k1TXrs4ddIFtMiGT89W4p9n4D2tS0p2vOXb1d/+Bryz3Ce1447w75jmGTUuFRGaCSAT4R+c18r6ynj+2b3fu/NEUrdp7AdGds6DQGtB7VEad3y+PYTnhwHef4dX9gZRy3rrUhFpNdPJk1SLpjsk860fGcqfuwtzg1G8VJFcbSSI1k09ZpG1xjS6flZNCKwRqhMQJ41/M8xx9NQ+//Kgkk1FMANGweX/ZbuJW8W2EQB2NXwmlFhbYFjcrS9fn4Mi2QMpNUdOtc67Qdx8E1vnkxxWWE17fHUMXfgqw/C2TEe3ZU20Th7RqJeyvnbs5StCTXPoijkwVYtKHFVCWwcFJwFnBJK7MvC2lm4fBs8YhEUso+5KQBqn1kMv0+po+dT5puoI2XJgwrPUrIwqtPblyU3fv8ky8cNCbyvNV1Lu3iN7e07penztXWA6au/Us/vzWumy6WEx0661E8+Y517oiItKH55FXcBGlFfPqtJ5EJVKRqVxCEW0L6eH5/g7tVx8EUnlllGhBMueF81Q/lf5EYolwfThhsI9tsduZlUXCT6OUFOHVFwxtLmatS8J7/5WSWVZCYxadpQ//o3LoO2UPV1gO2Pvu7/jiPR1lX7N2BSqVRO+843xlRURUJs0nXUApyWMu2RaxxuQtpMxRlQTaltQqNlxBJqOwdlb6xZYZotwUXPpDQ0p9GclURvLV1L6+mbuYIbTK81I0JEXza5nfuuQv/PNFL/LVKmnnFiX9a7f9uamO4grLAf98TUF/fx1c7X9PP13tT4cdeTsVRQUSqiiRk8Q/07aYNZJ9b15BeqrwnUq64PgkUu8Iays5h9PCeayiXzpQaZ6SvEOKqETZ+N+74hzhGDMaJCTPC7UtbrKOvFyAXiOz8b9nWpFaIaFbxpfQvDlSl1RWzAH3P/Y3FBoh3LnqNndu/aJ6/GOzoVDx+JUneeaYsI/FEjOiuqU5vG/u2WuNEozqnuzw/Zh7Va2SkDAwBUd+/rzR95MuqBCiynyCu3bV73ziSYbfWgKF1oCwtrnY9sknzeZ9NQlbXzqHuB4Z1Sqrjh1dcXBVPR7zFDNXJFn28W2bv3d430zf+zFUXmUgAhLHnnP4fsy9tmwR9m1ofKFH7KNWraznlFmzmv65YPXBMwhqkwWlVxl6jMhq8u+nSeo07ny1yooI2LnHWO+dERsrXMnv3V9R78dirhHaId1yxTtr618O75fB069AWVlhdRnD2do9m7BKwvJXP2vQ/XTwy+/QZXQSwmPLsPFYzZOTJ0ywnlP69GnaFdb8lQUIiSgHEdCubxZ2vOzYHEbmQrcss04irbp1H++apQA6DcyBd1g+1j7BVyKeQu9jTdmzZJnjFxLjJhkglgF37djHfUtUMOcFtsqGTGVE3zsdy2JSF089l4fut15F19vsP8eqhypABEhkFYhJzLW7rSe786GLCIjJg1Jfiu4TLjX4++Cgixo8eOhvfPd662r/C2qVS/2H1X8Jgv0f/opySRHpg0pJHstRgp5g7PLfYJII+9Y7rJBMPqm2m9QqLkpOZpPwNcq8xFGCnuy2xUkUGJdHf34aTgtXFrv85LrpnW9w7O0M6h7vRyf/aT8qrihAWCgUEJEyuGlG67TqlY6Xd8SQqVxK42al0E//jrH7nl2BK6wavPtPJRWkqy1/K7RG6tSvgPYubVvvHWJKC6XsaxoqL1YQ6a0rj7LGk3QylIqyhP2t0laQrs0V201q5RtjnWCcllatiHmYQ0u7iDr1KqW8ZB3970PXnvqGT0vHltt7UmSUiA4/pb7peULiI1RS5goxaX2F9dSaij3Hs9FzVDqSTvuSXGGmvv3N9OaTcTd9z6wB3PnEd5DIrN1DREB091Ts++iUS67IXnhBeEy11vFuJ9ZwNh69hJDWuZZ97RtkcGq/LDn6g/W+UU23a6clkanKIZGZMHTu7y7ZX6sfMsMnuBRzdv7m8OPNe+FDaP1KQAT0nuH4mGlj2/Brv8CSmUf0QZfS09O4uMizqSqYykUhn9/ZUx/vX0x6fR9+6f6fVfmEIsEer56+/fM6WHeL8KInX4/pLp1S6itIuMv76Y/vY6jV8xF0vM6DvzNPrd/zfE0vX/mXf5D9Xf99A3v0fDhrfP6p/9T7/9l/8T7zGvB70vXfI19H6vW6/Yv5/vVqf3vH3D69Zp3HmIxWbovKojlTq/8XNjjLHW5OAzN1r/mX/V/p5/v98wz5/zO99r6vEzv6XHz/uN469P88f9H/N8V/19T339Ff8A3H3E/Uv0t8UAAAAASUVORK5CYII=";

const DEFAULT_FORM_DATA: SalarySlipInput = {
  companyName: "",
  companyAddress: "",
  employerName: "",
  billDate: "2025-04-01",
  period: 'Quarterly',
  paymentPeriodStart: "2025-04-01",
  paymentPeriodEnd: "2026-03-31",
  startDateFY: "2025-04-01",
  billNumber: null,
  driverName: "",
  vehicleNumber: "",
  salaryBreakdown: [
    { item: "Basic Salary", amount: 0 },
  ],
  totalSalary: 0,
  signatureDataUri: DEFAULT_SIGNATURE,
  stampDataUri: DEFAULT_STAMP,
};

export default function DriverSalaryGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<SalarySlipInput>(DEFAULT_FORM_DATA);
  const [activeTab, setActiveTab] = useState("input");
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  const handleUpdateData = (data: SalarySlipInput) => {
    setFormData(data);
  };

  const handleGenerate = async (data: SalarySlipInput) => {
    setIsGenerating(true);
    setFormData(data);
    
    setTimeout(() => {
      setHasGeneratedOnce(true);
      setActiveTab("preview");
      toast({
        title: "Success",
        description: "Receipts generated for preview.",
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
          <h2 className="text-2xl font-bold tracking-tight">Driver Salary Receipts</h2>
          <p className="text-muted-foreground text-sm">Create and manage professional salary slips for your driver.</p>
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
            Receipt Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!hasGeneratedOnce} className="rounded-xl flex gap-2 h-full text-base">
            <FileText className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="no-print">
          <SalaryForm 
            initialData={formData} 
            onGenerate={handleGenerate} 
            onChange={handleUpdateData}
            isGenerating={isGenerating} 
          />
        </TabsContent>

        <TabsContent value="preview" className="print:block">
          {hasGeneratedOnce && (
            <div className="print:p-0">
              <SlipRenderer data={formData} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
