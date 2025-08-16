import { CommonColumns } from '@/@types/common';
import { UserResponse } from '@/@types/users';
import CommonActions from '@/components/custom-components/common-actions';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Key, Loader2 } from 'lucide-react';

interface UsersColumns extends CommonColumns<UserResponse> {
  handleResetPassword: (user: UserResponse) => void;
  deletingUsers: Set<number>;
  resettingUsers: Set<number>;
}

export const columns = ({
  handleDelete,
  handleResetPassword,
  deletingUsers,
  resettingUsers,
}: UsersColumns): ColumnDef<UserResponse>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name} {row.original.surname}
        </div>
      ),
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ getValue }) => <div className="text-gray-600">{getValue() as string}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => <div className="text-gray-600">{getValue() as string}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ getValue }) => {
        const role = getValue() as string;
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Badge className="h-3 w-3" />
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              status === 'ACTIVE'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: 'password-actions',
      header: 'Password',
      cell: ({ row }) => {
        const isResetting = resettingUsers.has(row.original.id);

        return (
          <Button size="sm" variant="outline" onClick={() => handleResetPassword(row.original)} disabled={isResetting}>
            {isResetting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Key className="h-3 w-3" />}
          </Button>
        );
      },
    },
    {
      id: 'delete-actions',
      header: '',
      cell: ({ row }) => (
        <CommonActions
          original={row.original}
          handleDelete={handleDelete}
          isDeleting={deletingUsers.has(row.original.id)}
        />
      ),
    },
  ];
};
