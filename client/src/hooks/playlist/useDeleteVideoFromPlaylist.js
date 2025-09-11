import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";


export const useDeleteVideoFromPlaylist = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({videoId ,playlistId}) => {
      const { data } = await axiosSecure.patch(
        `/playlist/remove-video/${videoId}/${playlistId}`,
      );
      return data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["userPlaylist"]);
    },



  });
};
