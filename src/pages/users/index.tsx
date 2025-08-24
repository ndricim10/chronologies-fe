import { UserResponse } from '@/@types/users';
import ConfirmationModal from '@/components/custom-components/confirmation-modal';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { GenericTable } from '@/components/tables/generic-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteUserMutation, useGetUsersQuery } from '@/redux/services/authApi';
import { initialPage } from '@/utils/common-functions';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import { PasswordResetModal } from './password-reset';
import { UserModal } from './user-modal';
import { useToast } from '@/hooks/use-toast';

export default function Users() {
  const { toast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse>();
  const [pagination, setPagination] = useState(initialPage);

  const [deletingUsers, setDeletingUsers] = useState<Set<number>>(new Set());
  const [resettingUsers, setResettingUsers] = useState<Set<number>>(new Set());

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    userId: null as number | null,
    userName: '',
  });

  const {
    data: usersData,
    isError,
    isFetching,
  } = useGetUsersQuery({
    ...pagination,
  });

  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDeleteClick = (user: UserResponse) => {
    setDeleteModal({
      open: true,
      userId: user.id,
      userName: `${user.name} ${user.surname}`,
    });
  };

  const handleDeleteConfirm = (userId: number) => {
    if (!userId) return;

    setDeletingUsers((prev) => new Set(prev).add(userId));

    deleteUser(userId)
      .unwrap()
      .then(() => {
        toast({
          title: 'Success!',
          description: 'The user has been successfully deleted',
          type: 'background',
        });
        setDeleteModal({ open: false, userId: null, userName: '' });
      })
      .catch((error) => {
        toast({
          title: 'Failed',
          description: error?.data?.message || 'An error occurred during upload',
          type: 'background',
        });
      })
      .finally(() => {
        setDeletingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });
  };

  const openResetDialog = (user: UserResponse) => {
    setSelectedUser(user);
    setResetModalOpen(true);
  };

  const users = usersData?.data || [];
  const needsFrontendPagination = users.length > 10;
  const totalPages = Math.ceil(users.length / pagination.size);

  const paginatedData = needsFrontendPagination
    ? users.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size)
    : users;

  const emptyStateContent = (
    <div className="py-8 text-center">
      <UsersIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">No users found</p>
      <p className="text-sm text-muted-foreground">Create your first user to get started</p>
    </div>
  );

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

            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <GenericTable<UserResponse>
                data={paginatedData}
                columns={columns({
                  deletingUsers,
                  resettingUsers,
                  handleDelete: handleDeleteClick,
                  handleResetPassword: openResetDialog,
                })}
                pagination={needsFrontendPagination ? pagination : undefined}
                setPagination={needsFrontendPagination ? setPagination : undefined}
                totalPages={needsFrontendPagination ? totalPages : undefined}
                isFetching={isFetching}
                isError={isError}
                noRowsChildren={emptyStateContent}
                showItemsPerPage={needsFrontendPagination}
                showJumpToEnds={needsFrontendPagination}
              />
            </CardContent>
          </Card>
        </div>

        <UserModal openModal={createModalOpen} setOpenModal={setCreateModalOpen} />

        <PasswordResetModal
          openModal={resetModalOpen}
          setOpenModal={setResetModalOpen}
          user={selectedUser}
          setResettingUsers={setResettingUsers}
        />

        <ConfirmationModal
          id={deleteModal.userId!}
          title="Delete User"
          description={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
          cancel="Cancel"
          submit="Delete"
          handleSubmit={handleDeleteConfirm}
          openModal={deleteModal.open}
          setOpenModal={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
          isLoading={isLoading}
        />
      </AppLayout>
    </AuthGuard>
  );
}
