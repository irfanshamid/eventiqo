'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateProfile } from '@/app/actions/profile';
import { useFormStatus } from 'react-dom';

interface User {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  gender: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>{pending ? 'Saving...' : 'Save changes'}</Button>
  );
}

export function ProfileForm({ user }: { user: User }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(formData: FormData) {
    setSuccess(false);
    setError(null);
    const res = await updateProfile(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          Profile updated successfully!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={user.username}
          disabled
          className="bg-gray-100"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Username cannot be changed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={user.name || ''}
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          defaultValue={user.email || ''}
          placeholder="m@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          defaultValue={user.phoneNumber || ''}
          placeholder="+62..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select name="gender" defaultValue={user.gender || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SubmitButton />
    </form>
  );
}
