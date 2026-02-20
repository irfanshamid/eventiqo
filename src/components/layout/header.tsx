"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Sidebar } from "./sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Helper to get title based on pathname
  const getTitle = () => {
    if (pathname.includes("/dashboard/panel")) return "Dashboard";
    if (pathname.includes("/dashboard/events")) return "Events";
    if (pathname.includes("/dashboard/tasks")) return "Tasks";
    if (pathname.includes("/dashboard/vendors")) return "Vendors";
    if (pathname.includes("/dashboard/team")) return "Team";
    if (pathname.includes("/dashboard/reports")) return "Reports";
    if (pathname.includes("/dashboard/finance")) return "Finance";
    if (pathname.includes("/dashboard/documents")) return "Documents";
    if (pathname.includes("/dashboard/sop")) return "SOP & Templates";
    if (pathname.includes("/dashboard/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                <Menu className="h-6 w-6 text-gray-500" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-[#1F2937] border-gray-700">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold text-gray-900">{getTitle()}</h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-gray-100">
                <span className="sr-only">Open user menu</span>
                <User className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer w-full flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={async () => await logoutAction()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
