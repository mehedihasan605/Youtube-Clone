import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetTweetById = (tweetId) => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["getTweetsById", tweetId],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(
          `/tweet/tweetById/${tweetId}`,
          {
            withCredentials: true,
          }
        );
        return data.data;
      } catch (error) {
        console.log("Tweets Error", error);
        throw error;
      }
    },
    enabled: !!tweetId,
  });
};
