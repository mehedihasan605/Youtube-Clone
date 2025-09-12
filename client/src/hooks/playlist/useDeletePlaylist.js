import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useDeletePlaylist = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async playlistId => {
      const { data } = await axiosSecure.delete(
        `/playlist/delete-playlist/${playlistId}`
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
      queryClient.invalidateQueries(['userPlaylist']);
    },
  });
};
