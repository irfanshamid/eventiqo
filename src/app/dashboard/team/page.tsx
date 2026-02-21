import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { TeamList } from '@/components/team/team-list';
import { redirect } from 'next/navigation';

export default async function TeamPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/api/auth/logout');

  const ownerId = user.managerId || user.id;

  // If Admin, show all. If User/Staff, show staff where managerId = ownerId
  const where = session.user.role === 'ADMIN' ? {} : { managerId: ownerId };

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const serializedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    role: u.role,
    isBanned: u.isBanned,
    createdAt: u.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Team Management
        </h1>
      </div>
      <TeamList initialUsers={serializedUsers} />
    </div>
  );
}
