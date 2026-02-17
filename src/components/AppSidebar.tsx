"use client";

import * as React from "react";
import { 
  FileText, 
  Receipt, 
  LayoutDashboard,
  Settings,
  HelpCircle,
  FileSpreadsheet
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
    title: "Driver Salary",
    icon: FileText,
    active: true,
  },
  {
    title: "Expense Bills",
    icon: Receipt,
    disabled: true,
  },
  {
    title: "Rent Receipts",
    icon: FileSpreadsheet,
    disabled: true,
  },
];

export function AppSidebar() {
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={item.active} 
                    tooltip={item.title}
                    disabled={item.disabled}
                    className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
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
