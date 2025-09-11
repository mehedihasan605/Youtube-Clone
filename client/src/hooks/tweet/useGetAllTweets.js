import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetAllTweets = (userId) => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["getUserChannalTweets", userId],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(`/tweet/tweets/${userId}`, {
          withCredentials: true
        });
        return data.data;
      } catch (error) {
        console.log("Tweets Error", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
