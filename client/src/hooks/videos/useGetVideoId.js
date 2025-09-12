import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetVideoId = (videoId) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: ["getVideoId", videoId],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(`/videos/video/${videoId}`, {
          withCredentials: true,
        });
        return data.data;
      } catch (error) {
        console.error("Video Details Error", error);
        throw error;
      }
    },
    
    enabled: !!videoId,
  });
};
