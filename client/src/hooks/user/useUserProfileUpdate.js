import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";


export const useUserProfileUpdate = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.patch(
        "/users/account-update",
        formData
      );
      return data;
    },
    onSuccess: (res) => {
      console.log("Update Success", res.data);
      queryClient.invalidateQueries(["user"]);

    },
    onError: (err) => {
      console.error(err.response?.data?.message || "Update failed");
    },
  });
};
