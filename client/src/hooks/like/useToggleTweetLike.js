import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useToggleTweetLike = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tweetId) => {
      const { data } = await axiosSecure.post("/likes/toggle/tweet", {
        tweetId: tweetId,
      });
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["getUserChannalTweets"]);
      toast.success(res.message);
    },
    onError: (err) => {
      console.error(err || "Liked Add or Removed failed");
    },
  });
};
