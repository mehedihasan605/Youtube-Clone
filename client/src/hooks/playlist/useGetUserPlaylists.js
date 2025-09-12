import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";


export const useGetUserPlaylists = (userId, sortBy = "createdAt") => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["playlists", userId, sortBy],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(
          `/playlist/c/playlists/${userId}?sortBy=${sortBy}`
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
