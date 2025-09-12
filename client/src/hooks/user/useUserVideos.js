import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from './../axios/useAxiosSecure';

export const useUserVideos = () => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ['user-videos'],

    queryFn: async () => {
      const { data } = await axiosSecure.get('/users/user-videos');
      return data.data;
    },

    onSuccess: data => {
      if (data) {
        console.log('Videos fetched successfully:', data);
      }
    },
    onError: error => {
      console.log(error);
    },
  });
};
