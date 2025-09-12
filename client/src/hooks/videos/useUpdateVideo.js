import { useMutation } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useUpdateVideo = videoId => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async formData => {
      const { data } = await axiosSecure.patch(
        `/videos/update-video/${videoId}`,

        formData
      );
      return data;
    },
    onSuccess: res => {
      console.log(res);
      toast.success(res.message);
    },
    onError: err => {
      console.error(err || 'Video Update Feild');
    },
  });
};
