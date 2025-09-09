import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useToggleCommentDislike = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId) => {
      const { data } = await axiosSecure.post("/dislikes/toggle/comment", {
        commentId: commentId,
      });
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["getVideoId"]);
      toast.success(res.message);
    },
    onError: (err) => {
      console.error(err || "Dislike Add or Removed failed");
    },
  });
};
