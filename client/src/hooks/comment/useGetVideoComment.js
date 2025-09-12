import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetVideoComment = ({videoId , sort}) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: ["getVideoComment" ,sort],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(
          `/comment/all-video-comments/${videoId}?sort=${sort}`,
          {
            withCredentials: true,
          }
        );
        return data.data;
      } catch (error) {
        console.error("Video Comment", error);
        throw error;
      }
    },
    enabled: !!videoId,
  });
};
