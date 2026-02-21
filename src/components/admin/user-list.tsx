'use client';

import { useState } from 'react';
import { createUser, resetPassword, toggleBanUser } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ban, Key, UserPlus, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string | null;
  name: string | null;
  role: string;
  isBanned: boolean;
  isFirstLogin: boolean;
}

export function UserList({ users }: { users: User[] }) {
  const [passwordResult, setPasswordResult] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  async function handleCreate(formData: FormData) {
    const res = await createUser(formData);
    if (res.success && res.password) {
      setPasswordResult({
        username: formData.get('username') as string,
        password: res.password,
      });
      setIsCreateOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleReset(user: User) {
    if (confirm(`Reset password for ${user.username}?`)) {
      const res = await resetPassword(user.id);
      if (res.success && res.password) {
        setPasswordResult({ username: user.username, password: res.password });
      }
    }
  }

  async function handleBan(user: User) {
    if (confirm(`${user.isBanned ? 'Unban' : 'Ban'} ${user.username}?`)) {
      await toggleBanUser(user.id, !user.isBanned);
    }
  }

  return (
    <div className="space-y-4">
      {passwordResult && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">
            Credentials for {passwordResult.username}:{' '}
            <code className="bg-white px-2 py-1 rounded border">
              {passwordResult.password}
            </code>
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setPasswordResult(null)}
          >
            <span className="text-xl">&times;</span>
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E88E5]">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue="USER">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name || '-'}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-500">
                      Active
                    </Badge>
                  )}
                  {user.isFirstLogin && (
                    <Badge variant="secondary" className="ml-2">
                      New
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReset(user)}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={user.isBanned ? 'default' : 'destructive'}
                    size="sm"
                    onClick={() => handleBan(user)}
                  >
                    {user.isBanned ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
