import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from './../axios/useAxiosSecure';
import { useAuthStatus } from '../auth/useAuthStatus';

export const useUserVideos = () => {
    const { isAuthenticated } = useAuthStatus();
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ['user-videos'],

    queryFn: async () => {
      const { data } = await axiosSecure.get('/users/user-videos');
      return data.data;
    },
 enabled: isAuthenticated,
    
  });
};
