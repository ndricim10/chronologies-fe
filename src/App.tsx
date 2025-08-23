import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from './components/layout/AuthGuard';
import Login from './pages/auth/Login';
import Chronologies from './pages/chronologies';
import NotFound from './pages/not-found';
import Profile from './pages/profile/Profile';
import Users from './pages/users';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/chronologies" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chronologies"
          element={
            <AuthGuard>
              <Chronologies />
            </AuthGuard>
          }
        />

        <Route
          path="/users"
          element={
            <AuthGuard requiredRole="ADMIN">
              <Users />
            </AuthGuard>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
