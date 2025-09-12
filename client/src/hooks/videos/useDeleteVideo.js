import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useDeleteVideo = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async videoId => {
      const { data } = await axiosSecure.delete(
        `/videos/delete-video/${videoId}`
      );
      return data;
    },
    onSuccess: res => {
      console.log(res);
      toast.success(res.message);
      queryClient.invalidateQueries(['user-videos']);
    },
    onError: err => {
      console.error(err || 'video Delete failed');
    },
  });
};
