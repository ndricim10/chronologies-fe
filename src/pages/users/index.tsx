import { UserResponse } from '@/@types/users';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useResetPasswordMutation,
} from '@/redux/services/authApi';
import { Badge, Key, Loader2, Plus, Trash2, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';

export default function Users() {
  const { toast } = useToast();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse>();

  const [createForm, setCreateForm] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    role: 'FINANCE',
    password: '',
  });

  const [newPassword, setNewPassword] = useState('');

  const { data: usersData, isLoading } = useGetUsersQuery({
    page: 1,
    size: 50,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser(createForm).unwrap();
      toast({
        title: 'User created',
        description: 'The user has been successfully created',
      });
      setCreateDialogOpen(false);
      setCreateForm({
        username: '',
        name: '',
        surname: '',
        email: '',
        role: 'FINANCE',
        password: '',
      });
    } catch (error: any) {
      toast({
        title: 'Creation failed',
        description: error?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(id).unwrap();
      toast({
        title: 'User deleted',
        description: 'The user has been successfully deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Deletion failed',
        description: error?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      await resetPassword({
        id: selectedUser.id,
        newPassword,
      }).unwrap();
      toast({
        title: 'Password reset',
        description: 'The password has been successfully reset',
      });
      setResetDialogOpen(false);
      setNewPassword('');
    } catch (error: any) {
      toast({
        title: 'Reset failed',
        description: error?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const openResetDialog = (user: UserResponse) => {
    setSelectedUser(user);
    setResetDialogOpen(true);
  };

  return (
    <AuthGuard requiredRole="ADMIN">
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold">
                <UsersIcon className="h-8 w-8 text-primary" />
                User Management
              </h1>
              <p className="mt-2 text-muted-foreground">Manage system users and their permissions</p>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>Add a new user to the system</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">First Name</Label>
                      <Input
                        id="create-name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-surname">Last Name</Label>
                      <Input
                        id="create-surname"
                        value={createForm.surname}
                        onChange={(e) => setCreateForm({ ...createForm, surname: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-username">Username</Label>
                    <Input
                      id="create-username"
                      value={createForm.username}
                      onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-email">Email</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-role">Role</Label>
                    <Select
                      value={createForm.role}
                      onValueChange={(value: 'ADMIN' | 'FINANCE') => setCreateForm({ ...createForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-password">Temporary Password</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading users...</span>
                </div>
              ) : usersData?.data && usersData.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name} {user.surname}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            <Badge className="h-3 w-3" />
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              user.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => openResetDialog(user)}>
                              <Key className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <UsersIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for {selectedUser?.name} {selectedUser?.surname}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isResetting}>
                {isResetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  );
}
