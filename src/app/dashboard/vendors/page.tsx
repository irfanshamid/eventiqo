import prisma from '@/lib/prisma';
import { VendorList } from '@/components/vendors/vendor-list';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function VendorsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/api/auth/logout');

  const ownerId = user.managerId || user.id;

  const vendors = await prisma.vendor.findMany({
    where: { createdById: ownerId },
    include: {
      events: true,
      expenses: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Vendor Management
        </h1>
      </div>
      <VendorList vendors={vendors} />
    </div>
  );
}
