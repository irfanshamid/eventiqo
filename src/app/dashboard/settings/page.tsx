import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ProfileForm } from '@/components/settings/profile-form';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || !session.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/api/auth/logout');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>
      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileForm
            user={{
              id: user.id,
              username: user.username,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              gender: user.gender,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
