import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';

export const useGetUserTweets = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['getUserTweets'],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get('/tweet/user-tweets');
        return data.data;
      } catch (error) {
        console.error('Tweets Error', error);
        throw error;
      }
    },
  });
};
