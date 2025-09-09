import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useToggleVideoDislike = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId) => {
      const { data } = await axiosSecure.post("/dislikes/toggle/video", {
        videoId: videoId,
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
