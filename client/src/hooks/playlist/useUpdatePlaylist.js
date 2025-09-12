import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useUpdatePlaylist = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, playlistId }) => {
      const { data } = await axiosSecure.patch(
        `/playlist/update-playlist/${playlistId}`,
        formData
      );
      return data;
    },
    onSuccess: res => {
      queryClient.invalidateQueries(['playlistDetails']);
      toast.success(res.message);
    },
    onError: err => {
      console.error(err || 'Playlist Update failed');
    },
  });
};
