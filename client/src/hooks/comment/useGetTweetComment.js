import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetTweetComment = ({ tweetId, sort }) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: ["getTweetComment", sort],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(
          `/comment/all-tweet-comments/${tweetId}?sort=${sort}`,
          {
            withCredentials: true,
          }
        );
        return data.data;
      } catch (error) {
        console.log("Video Comment", error);
        throw error;
      }
    },
    enabled: !!tweetId,
  });
};
