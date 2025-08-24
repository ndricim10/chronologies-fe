import { authApi } from '@/redux/services/authApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    localStorage.removeItem('idToken');
    navigate('/login');
    dispatch(authApi.util.resetApiState());
  };

  return handleSignOut;
};
