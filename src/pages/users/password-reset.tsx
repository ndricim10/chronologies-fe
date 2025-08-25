import { OpenModalProps } from '@/@types/common';
import { UserResponse } from '@/@types/users';
import { GenericModal } from '@/components/dialogs/generic-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useResetPasswordMutation } from '@/redux/services/authApi';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';

interface PasswordResetModalProps extends OpenModalProps {
  user?: UserResponse;
  setResettingUsers: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export const PasswordResetModal = ({ openModal, setOpenModal, user, setResettingUsers }: PasswordResetModalProps) => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { error, success } = useToast();

  const [newPassword, setNewPassword] = useState('');

  const onSubmit = (password: string) => {
    if (!user) return;

    setResettingUsers((prev) => new Set(prev).add(user.id));
    resetPassword({
      id: user.id,
      newPassword: password,
    })
      .unwrap()
      .then(() => {
        success({
          title: 'Success!',
          description: 'The password has been successfully reset',
        });
        setOpenModal(false);
        setNewPassword('');
      })
      .catch((err) => {
        error({
          title: 'Failed',
          description: err?.data?.message || 'An error occurred during upload',
        });
      })
      .finally(() => {
        if (user) {
          setResettingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(user.id);
            return newSet;
          });
        }
      });
  };

  return (
    <GenericModal<any, string>
      openModal={openModal}
      setOpenModal={setOpenModal}
      icon={<KeyRound className="h-6 w-6" />}
      title="Reset Password"
      description={user ? `Set a new password for ${user.name} ${user.surname}` : 'Reset user password'}
      onSubmit={onSubmit}
      isLoading={isLoading}
      saveLabel="Reset Password"
      cancelLabel="Cancel"
      maxWidth="md"
      form={undefined}
      setDefaultValues={() => {}}
      onClose={() => setNewPassword('')}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password *</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              The user will be notified of the password change and prompted to update it on next login
            </p>
          </div>

          {user && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm">
                <span className="font-medium">User:</span> {user.name} {user.surname}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Username:</span> {user.username}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </GenericModal>
  );
};
