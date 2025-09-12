import { useMutation } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';
import toast from 'react-hot-toast';

export const useUploadVideo = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async formData => {
      const { data } = await axiosSecure.post(`/videos/post-video`, formData);
      return data;
    },
    onSuccess: res => {
   
      toast.success(res.message);
    },
    onError: err => {
      console.error(err || 'Video Upload Feild');
    },
  });
};
