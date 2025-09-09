import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useCreateVideoComment = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData) => {
      const { data } = await axiosSecure.post(
        "/comment/add-video-comment",
        commentData
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["getVideoComment"]);
      toast.success(res.message);
    },
    onError: (err) => {
      console.error(err || "Comment Added failed");
    },
  });
};
