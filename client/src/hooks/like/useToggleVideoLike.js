import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useToggleVideoLike = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId) => {
      const { data } = await axiosSecure.post("/likes/toggle/video", {
        videoId: videoId
      });
      return data;
    },
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries(["getVideoId"]),
        queryClient.invalidateQueries(["getLikedVideos"]),
      ]);

      toast.success(res.message)
    },
    onError: (err) => {
      console.error(err || "Liked Add or Removed failed");
    },
  });
};
