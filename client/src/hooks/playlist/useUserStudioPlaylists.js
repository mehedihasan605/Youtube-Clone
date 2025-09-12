import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../axios/useAxiosSecure';

export const useUserStudioPlaylists = () => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ['userPlaylist'],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/playlist/user-playlists`);
        return data.data;
      } catch (error) {
        console.log('Playlists Error', error);
        throw error;
      }
    },
  });
};
