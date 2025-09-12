import { useMutation } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useAddVideoPlaylist = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const { data } = await axiosSecure.patch(
        `/playlist/add-video/${videoId}/${playlistId}`
      );
      return data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (err) => {
      console.error(err || "Playlist Update failed");
    },
  });
};
