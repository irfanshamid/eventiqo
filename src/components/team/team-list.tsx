'use client';

import { useState, useEffect } from 'react';
import {
  createUser,
  toggleBanUser,
  deleteUser,
  resetPassword,
} from '@/app/actions/users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  UserPlus,
  Mail,
  Shield,
  MoreHorizontal,
  Copy,
  Ban,
  Trash2,
  CheckCircle,
  Search,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  role: string;
  isBanned: boolean;
  createdAt: Date;
}

export function TeamList({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Temporary storage for passwords of newly created users in this session
  const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Confirm Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDesc, setConfirmDesc] = useState('');
  const [confirmVariant, setConfirmVariant] = useState<
    'default' | 'destructive'
  >('default');

  const router = useRouter();

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  async function handleCreate(formData: FormData) {
    setIsLoading(true);
    const username = formData.get('username') as string;
    const res = await createUser(formData);
    setIsLoading(false);

    if (res.success) {
      // Store the password temporarily for this session
      if (res.password) {
        // We need to wait for the refresh to complete to get the user ID,
        // but we can map it by username temporarily or just hope the refresh is fast enough?
        // Actually, we don't have the ID yet.
        // Let's store by username, and then when rendering, we check.
        setNewPasswords((prev) => ({ ...prev, [username]: res.password! }));
      }
      setIsAddOpen(false);
      router.refresh();
    } else {
      alert(res.error);
    }
  }

  function openBanConfirm(user: User) {
    setConfirmTitle(user.isBanned ? 'Unban Staff' : 'Ban Staff');
    setConfirmDesc(
      `Are you sure you want to ${user.isBanned ? 'unban' : 'ban'} ${user.name}?`,
    );
    setConfirmVariant(user.isBanned ? 'default' : 'destructive');
    setConfirmAction(() => async () => {
      await toggleBanUser(user.id, !user.isBanned);
      router.refresh();
    });
    setConfirmOpen(true);
  }

  function openDeleteConfirm(user: User) {
    setConfirmTitle('Delete Staff');
    setConfirmDesc(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
    );
    setConfirmVariant('destructive');
    setConfirmAction(() => async () => {
      await deleteUser(user.id);
      router.refresh();
    });
    setConfirmOpen(true);
  }

  async function handleCopyCredentials(user: User) {
    // Check if we have the password in temporary session storage
    if (newPasswords[user.username]) {
      const password = newPasswords[user.username];
      const text = `username = ${user.username}\npassword = ${password}`;
      navigator.clipboard.writeText(text);
      alert(`Credentials for ${user.username} copied to clipboard!`);
      return;
    }

    // If not found, ask to reset
    if (
      !confirm(
        `Password for ${user.username} is unknown (encrypted). Do you want to reset it to get new credentials?`,
      )
    ) {
      return;
    }

    const res = await resetPassword(user.id);
    if (res.success && res.password) {
      // Update our local cache
      setNewPasswords((prev) => ({ ...prev, [user.username]: res.password! }));

      const text = `username = ${user.username}\npassword = ${res.password}`;
      navigator.clipboard.writeText(text);
      alert(`Credentials for ${user.username} copied to clipboard!`);
    } else {
      alert('Failed to reset password');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search staff..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E88E5] hover:bg-[#1565C0]">
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleCreate}>
              <DialogHeader>
                <DialogTitle>Add New Staff</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    required
                    placeholder="johndoe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>
                <input type="hidden" name="role" value="STAFF" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="py-4">Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-32 text-gray-500"
                >
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        />
                        <AvatarFallback className="bg-[#1E88E5] text-white">
                          {user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email || 'No email'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {user.username}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleCopyCredentials(user)}
                        >
                          <Copy className="mr-2 h-4 w-4 text-blue-600" /> Copy
                          Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openBanConfirm(user)}>
                          {user.isBanned ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />{' '}
                              Unban
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4 text-orange-600" />{' '}
                              Ban
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => openDeleteConfirm(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmAction}
        variant={confirmVariant}
      />
    </div>
  );
}
