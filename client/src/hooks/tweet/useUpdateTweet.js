import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useUpdateTweet = tweetId => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async content => {
      console.log(content);
      const { data } = await axiosSecure.patch(
        `/tweet/update-tweets/${tweetId}`,
        {
          content: content,
        }
      );

      return data;
    },
    onSuccess: res => {
      toast.success(res.message);
      console.log(res);
      queryClient.invalidateQueries(['getUserTweets']);
    },
    onError: err => {
      console.error(err || 'Tweet Update failed');
    },
  });
};
