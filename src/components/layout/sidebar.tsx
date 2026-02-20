'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  BookOpen,
  Settings,
  PieChart,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/panel',
    icon: LayoutDashboard,
  },
  {
    title: 'Event',
    href: '/dashboard/events',
    icon: CalendarDays,
  },
  {
    title: 'Tugas',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Vendor',
    href: '/dashboard/vendors',
    icon: Users,
  },
  {
    title: 'Tim',
    href: '/dashboard/team',
    icon: Briefcase,
  },
  {
    title: 'Laporan',
    href: '/dashboard/reports',
    icon: PieChart,
  },
  {
    title: 'Keuangan Event',
    href: '/dashboard/finance',
    icon: DollarSign,
  },
  {
    title: 'Proposal & Kontrak',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    title: 'SOP & Template',
    href: '/dashboard/sop',
    icon: BookOpen,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#1F2937] text-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-700">
        <div className="relative h-10 w-32">
          <Image
            src="/logo.png"
            alt="Eventiqo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-white',
                pathname === item.href || pathname?.startsWith(item.href + '/')
                  ? 'bg-[#1E88E5] text-white'
                  : 'text-gray-300',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
