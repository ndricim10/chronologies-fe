import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLoginMutation } from '@/redux/services/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Eye, EyeOff, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (values: LoginForm) => {
    login(values)
      .unwrap()
      .then((res) => {
        localStorage.setItem('idToken', res?.token);
        success({ title: 'Welcome back!', description: 'You have been successfully signed in.' });
        navigate('/chronologies');
      })
      .catch((err) => {
        error({
          title: 'Authentication Failed',
          description: err?.data?.message || 'Invalid username or password',
        });
      });
  };

  const disabled = isLoading || formState.isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid min-h-[calc(100vh-6rem)] items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <img
                  src="https://albaen.it/wp-content/uploads/logo_alban.png"
                  alt="Alba&N - Produttori di Scarpe Antinfortunistiche"
                />
              </div>
              <p className="mb-8 text-xl text-gray-300">
                Professional chronology management platform for legal and business professionals
              </p>
            </div>

            <div className="mx-auto grid max-w-md gap-6 lg:mx-0">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/20">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure & Reliable</h3>
                  <p className="text-sm text-gray-300">Enterprise-grade security for your sensitive data</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/20">
                  <Clock className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Time Management</h3>
                  <p className="text-sm text-gray-300">Efficient chronological organization tools</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/20">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Team Collaboration</h3>
                  <p className="text-sm text-gray-300">Seamless collaboration across your organization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
              <CardHeader className="pb-8 pt-8 text-center">
                <CardTitle className="mb-2 text-3xl font-bold text-gray-900">Welcome back</CardTitle>
                <CardDescription className="text-lg text-gray-600">Sign in to your account to continue</CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <label className="text-base font-medium text-white">Username</label>
                    <Input
                      placeholder="Enter your username"
                      {...register('username')}
                      disabled={disabled}
                      className="h-12 border-gray-200 text-base focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-white">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...register('password')}
                        disabled={disabled}
                        className="h-12 border-gray-200 pr-10 text-base focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                    isLoading={disabled}
                  >
                    <div className="text-white">{disabled ? 'Signing in...' : 'Sign in to your account'}</div>
                  </Button>

                  <div className="pt-4 text-center">
                    <p className="text-sm text-gray-500">Need help? Contact your system administrator</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
