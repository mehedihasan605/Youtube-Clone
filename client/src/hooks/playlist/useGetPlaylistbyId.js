import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetPlaylistbyId = (playListId) => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["playlistDetails", playListId],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(
          `/playlist/c/playlistbyid/${playListId}`);
        return data.data;
      } catch (error) {
        console.error("Playlists Error", error);
        throw error;
      }
      },
    enabled: !!playListId
  });
};
