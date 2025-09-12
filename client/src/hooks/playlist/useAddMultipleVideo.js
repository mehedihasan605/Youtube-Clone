import { useMutation } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useAddMultipleVideo = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async payload => {
      const { data } = await axiosSecure.patch(`/playlist/add-videos`, payload);
      return data;
    },
    onSuccess: res => {
      toast.success(res.message);
    },
    onError: err => {
      console.error(err || 'Playlist Update failed');
    },
  });
};
