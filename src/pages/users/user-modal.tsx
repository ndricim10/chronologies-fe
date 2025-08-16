import { OpenModalProps } from '@/@types/common';
import { ROLES } from '@/@types/enums';
import { CreateUser } from '@/@types/users';
import { GenericModal } from '@/components/dialogs/generic-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUserMutation } from '@/redux/services/authApi';
import { toastComponent } from '@/utils/common-functions';
import { initUser } from '@/utils/initial-values';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Select a role'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export const UserModal = ({ openModal, setOpenModal }: OpenModalProps) => {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initUser,
    mode: 'onTouched',
  });

  const onSubmit = (data: CreateUser) => {
    createUser(data)
      .unwrap()
      .then(() => {
        toastComponent('The user has been successfully created');
        setOpenModal(false);
      })
      .catch((error) => {
        toastComponent(error?.data?.message || 'An error occurred', 'error');
      });
  };

  const disabled = isLoading || form.formState.isSubmitting;

  return (
    <GenericModal<CreateUser, CreateUser>
      openModal={openModal}
      setOpenModal={setOpenModal}
      icon={<UserPlus className="h-6 w-6 text-primary" />}
      title="Create New User"
      description="Add a new user to the system with their credentials and role"
      isLoading={disabled}
      saveLabel="Create User"
      cancelLabel="Cancel"
      maxWidth="md"
      form={undefined}
      setDefaultValues={() => {}}
      onSubmit={onSubmit}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" disabled={disabled} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" disabled={disabled} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" disabled={disabled} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" disabled={disabled} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Select disabled={disabled} value={field.value} onValueChange={(v) => field.onChange(v as ROLES)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.finance}>Finance</SelectItem>
                        <SelectItem value={ROLES.admin}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporary Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter temporary password" disabled={disabled} {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    The user will be prompted to change this password on first login
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </GenericModal>
  );
};
