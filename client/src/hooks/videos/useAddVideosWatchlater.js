import { useMutation } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useAddVideosWatchlater = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (videoId) => {
      const { data } = await axiosSecure.post("/watchlater/add-video", {
        videoId: videoId,
      });
      return data;
    },
    onSuccess: (res) => {
      if (res.message === "Video in WatchLater") {
        toast.success(res.message);
      } else {
        toast.error(res.message)
      }

    },
    onError: (err) => {
      console.error(err || "Watchlater video Added failed");
    },
  });
};
