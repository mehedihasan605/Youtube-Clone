import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';

export const useGetChannelStats = () => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ['getChannelStats'],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get('/dashboard/stats');
        return data.data;
      } catch (error) {
        console.log('Channel Stats Error', error);
        throw error;
      }
    },
  });
};
