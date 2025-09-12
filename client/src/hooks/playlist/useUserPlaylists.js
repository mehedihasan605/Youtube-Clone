import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useUserPlaylists = (userId, sortBy = "createdAt") => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["userPlaylist", userId, sortBy],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(
          `/playlist/c/user-playlists/${userId}?sortBy=${sortBy}`
        );
        return data.data;
      } catch (error) {
        console.error("Playlists Error", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
