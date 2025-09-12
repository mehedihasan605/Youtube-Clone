import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useDeleteTweet = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async tweetId => {
      const { data } = await axiosSecure.delete(
        `/tweet/delete-tweets/${tweetId}`
      );
      return data;
    },
    onSuccess: res => {
      toast.success(res.message);
    },
    onError: err => {
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['getUserTweets']);
    },
  });
};
