import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useSubscribeToogle = () => {
  const axiosSecure = useAxiosSecure();
const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channalId) => {
      const { data } = await axiosSecure.post("/subscribe/c/subscribe", {
        channalId: channalId,
      });
      return data;
    },
      onSuccess: (res) => {
     queryClient.invalidateQueries(["profileDetails"]);
      toast.success(res.data)
    },
    onError: (err) => {
      console.error(err || "Subscribed failed");
    },
  });
};
