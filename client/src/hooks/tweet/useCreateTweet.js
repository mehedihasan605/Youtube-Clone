import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useCreateTweet = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosSecure.post(`/tweet/create-tweets`, payload);
      return data;
    },
    onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries(["getUserChannalTweets"]);
      
    },
    onError: (err) => {
      console.error(err || "Tweet Create failed");
    },
  });
};
