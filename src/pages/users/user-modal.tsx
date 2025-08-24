import { OpenModalProps } from '@/@types/common';
import { ROLES } from '@/@types/enums';
import { FormFieldItems } from '@/@types/form-render';
import { CreateUser } from '@/@types/users';
import { GenericModal } from '@/components/dialogs/generic-modal';
import FormRender from '@/components/form-render/form-render';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useCreateUserMutation } from '@/redux/services/authApi';
import { commonOptions } from '@/utils/common-options';
import { initUser } from '@/utils/initial-values';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
  const { toast } = useToast();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initUser,
    mode: 'onTouched',
  });

  const onClose = () => {
    setOpenModal(false);
    form.reset(initUser);
  };

  const onSubmit = (data: CreateUser) => {
    createUser(data)
      .unwrap()
      .then(() => {
        toast({
          title: 'Success!',
          description: 'The user has been successfully created',
          type: 'background',
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: 'Failed',
          description: error?.data?.message || 'An error occurred during upload',
          type: 'background',
        });
      });
  };

  const disabled = isLoading || form.formState.isSubmitting;

  const formFields: FormFieldItems<any>[] = [
    {
      name: 'firstName',
      label: 'First Name *',
      placeholder: 'Enter first name',
      type: 'inputText',
      disabled: false,
    },
    {
      name: 'surname',
      label: 'Last Name *',
      placeholder: 'Enter last name',
      type: 'inputText',
      disabled: false,
    },
    {
      name: 'username',
      label: 'Username *',
      placeholder: 'Enter username',
      type: 'inputText',
      disabled: false,
    },
    {
      name: 'role',
      label: 'Role *',
      type: 'select',
      placeholder: 'Select a role',
      dropdownData: {
        options: commonOptions(ROLES),
      },
      disabled: false,
    },
    {
      name: 'email',
      label: 'Email *',
      placeholder: 'Enter email address',
      type: 'inputEmail',
      disabled: false,
      gridcolumnclass: 'col-span-2',
    },

    {
      name: 'password',
      label: 'Temporary Password *',
      placeholder: 'Enter temporary password',
      type: 'inputPassword',
      disabled: false,
      gridcolumnclass: 'col-span-2',
    },
  ];

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
      maxWidth="2xl"
      form={form}
      setDefaultValues={() => {}}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <Form {...form}>
          <FormRender form={form} formFields={formFields} formFieldWrapperStyles="grid grid-cols-2" />
        </Form>
      </div>
    </GenericModal>
  );
};
