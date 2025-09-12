import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useRemoveWatchlater = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (watchlaterId) => {
      const { data } = await axiosSecure.delete(
        `/watchlater/remove-video/${watchlaterId}`
      );
      return data;
    },
    onSuccess: (res) => {
      
      toast.success(res.message);
      queryClient.invalidateQueries(["watchlater"]);
    },
    onError: (err) => {
      console.error(err || "WatchLater video Delete failed");
    },
  });
};
