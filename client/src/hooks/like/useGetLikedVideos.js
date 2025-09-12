import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useGetLikedVideos = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["getLikedVideos"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/likes/liked-videos");
        return data.data;
      } catch (error) {
        console.error("Liked Videos", error);
        throw error;
      }
    },

  });
};
