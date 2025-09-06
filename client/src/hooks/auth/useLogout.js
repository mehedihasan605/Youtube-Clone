import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useLogout = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    const { data } = await axiosSecure.post("/users/logout");
    queryClient.invalidateQueries(["user"]);
    navigate("/");
    return data;
  };

  return logout;
};
