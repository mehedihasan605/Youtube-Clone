import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';

export const useChannelDashboardVideos = (query = '') => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ['dashboardVideos', query],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(
          `/dashboard/videos?query=${query}`
        );
        return data.data;
      } catch (error) {
        console.log('Channel Stats Error', error);
        throw error;
      }
    },
  });
};
