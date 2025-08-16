import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useGetLoggedInUserQuery, useUpdatePasswordMutation, useUpdateProfileMutation } from '@/redux/services/authApi';
import { toastComponent } from '@/utils/common-functions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Save, User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
});

type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((vals) => vals.newPassword === vals.confirmPassword, {
    path: ['confirmPassword'],
    message: 'New password and confirmation do not match',
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user } = useAuth();

  const { data: userData } = useGetLoggedInUserQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', surname: '', email: '' },
    mode: 'onTouched',
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (userData) {
      profileForm.reset({
        name: userData.name || '',
        surname: userData.surname || '',
        email: userData.email || '',
      });
    }
  }, [userData, profileForm]);

  const submitProfile = (values: ProfileValues) => {
    updateProfile(values)
      .unwrap()
      .then(() => toastComponent('Your profile information has been successfully updated'))
      .catch((error) => {
        toastComponent(error?.data?.message || 'An error occurred while updating your profile', 'error');
      });
  };

  const submitPassword = (values: PasswordValues) => {
    updatePassword(values)
      .unwrap()
      .then(() => {
        toastComponent('Your password has been successfully changed');
        passwordForm.reset();
      })
      .catch((error) => {
        error?.data?.message || 'An error occurred while changing your password';
      });
  };

  const profileDisabled = isUpdatingProfile || profileForm.formState.isSubmitting;
  const passwordDisabled = isUpdatingPassword || passwordForm.formState.isSubmitting;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <User className="h-8 w-8 text-primary" />
            Profile Settings
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your account information and security settings</p>
        </div>

        {/* Personal Info */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(submitProfile)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" disabled={profileDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" disabled={profileDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" disabled={profileDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FormLabel>Username</FormLabel>
                    <Input value={user?.username || ''} disabled className="bg-muted" />
                  </div>
                  <div>
                    <FormLabel>Role</FormLabel>
                    <Input value={user?.role || ''} disabled className="bg-muted" />
                  </div>
                </div>

                <Button type="submit" disabled={profileDisabled}>
                  {profileDisabled ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(submitPassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Current password" disabled={passwordDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="New password" disabled={passwordDisabled} {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          disabled={passwordDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={passwordDisabled}>
                  {passwordDisabled ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
