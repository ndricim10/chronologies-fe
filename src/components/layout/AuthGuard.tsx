import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@/hooks/use-logout';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'FINANCE';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const location = useLocation();
  const { user, token, isError, isFetching } = useAuth();
  const handleLogout = useLogout();

  useEffect(() => {
    if (isError) {
      handleLogout();
    }
  }, [isError]);

  if (token && isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="space-y-4 py-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <span className="text-2xl text-destructive">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page. Required role: {requiredRole}
        </p>
        <Navigate to="/chronologies" replace />
      </div>
    );
  }

  return <>{children}</>;
}
