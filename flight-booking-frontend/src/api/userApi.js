import axiosClient from "./axiosClient";

const userApi = {
  login: (email, password) =>
    axiosClient.post("/auth/login", { email, password }),
  register: (data) => axiosClient.post("/auth/register", data), // data = { name, email, password }
};

export default userApi;
