import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetUserChannalVideos = (userId) => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["getUserChannalVideos", userId],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(`/videos/userChannalVideos/${userId}`);
        return data.data;
      } catch (error) {
        console.error("Letest & Populer & Oldest videos api Error", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
