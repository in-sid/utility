
"use client";

import * as React from "react";
import { 
  FileText, 
  Receipt, 
  Settings,
  HelpCircle,
  FileSpreadsheet,
  BookOpen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const navItems = [
  {
    id: "driver-salary",
    title: "Driver Salary",
    icon: FileText,
  },
  {
    id: "book-bills",
    title: "Book Bills",
    icon: BookOpen,
  },
  {
    id: "rent-receipts",
    title: "Rent Receipts",
    icon: FileSpreadsheet,
    disabled: true,
  },
];

interface AppSidebarProps {
  activeSection: string;
  onSelect: (id: string) => void;
}

export function AppSidebar({ activeSection, onSelect }: AppSidebarProps) {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b h-14 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg">
            <FileText className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Bill Generator
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id} 
                    tooltip={item.title}
                    disabled={item.disabled}
                    className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                    onClick={() => !item.disabled && onSelect(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Support">
              <HelpCircle />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
