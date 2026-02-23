import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session?.user?.id) {
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true },
      });
    } catch (error) {
      console.error('Error checking user in DashboardLayout:', error);
    }

    if (!user) {
      redirect('/api/auth/logout');
    }
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      <div className="hidden md:flex w-64 flex-col">
        <Sidebar userRole={session?.user?.role} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={session?.user} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
