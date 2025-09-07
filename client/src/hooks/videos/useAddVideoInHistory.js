import { useMutation } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useAddVideoInHistory = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (videoId) => {
      const { data } = await axiosSecure.post("/watched/add-video", {
        videoId: videoId,
      });
      return data;
    },
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err || "Watch History video Added failed");
    },
  });
};
