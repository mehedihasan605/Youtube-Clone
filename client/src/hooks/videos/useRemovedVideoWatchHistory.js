import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useRemovedVideoWatchHistory = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (historyId) => {
      const { data } = await axiosSecure.delete(
        `/watched/remove-video/${historyId}`
      );
      return data;
    },
    onSuccess: (res) => {
     
      toast.success(res.message);
      queryClient.invalidateQueries(["getUserWatchHistory"]);
    },
    onError: (err) => {
      console.error(err || "Watch History video Delete failed");
    },
  });
};
