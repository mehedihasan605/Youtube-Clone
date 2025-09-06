import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAxiosPublic } from "../axios/useAxiosPublic";


export const useRegister = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosPublic.post("/users/register", formData, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: (data) => {
      console.log("Registration success:", data);
      navigate("/");
    },
    onError: (error) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
