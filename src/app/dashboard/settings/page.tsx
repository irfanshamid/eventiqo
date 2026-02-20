import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ProfileForm } from '@/components/settings/profile-form';
import { Button } from '@/components/ui/button';
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
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <Button
              variant="ghost"
              className="justify-start bg-muted hover:bg-muted"
            >
              Profile
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-transparent hover:underline"
            >
              Account
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-transparent hover:underline"
            >
              Appearance
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-transparent hover:underline"
            >
              Notifications
            </Button>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This is how others will see you on the site.
                </CardDescription>
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
        </div>
      </div>
    </div>
  );
}
