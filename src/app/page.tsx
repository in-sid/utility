import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import DriverSalaryGenerator from "@/components/DriverSalaryGenerator";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 no-print">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Driver Salary</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <DriverSalaryGenerator />
        </main>
      </SidebarInset>
    </div>
  );
}
