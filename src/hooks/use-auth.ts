import { useGetLoggedInUserQuery } from '@/redux/services/authApi';
import { useLocation } from 'react-router';

export const useAuth = () => {
  const token = localStorage.getItem('idToken');
  const { pathname } = useLocation();

  const {
    data: user,
    isFetching,
    isLoading,
    isError,
  } = useGetLoggedInUserQuery(undefined, {
    skip: pathname.includes('login') || !token,
  });
  return {
    user,
    isFetching,
    isLoading,
    isError: (isError || !user || !token) && !isFetching,
    token,
  };
};
