import axiosClient from "./axiosClient";

const bookingApi = {
  getAll: () => axiosClient.get("/bookings"),
  create: (data) => axiosClient.post("/bookings", data),
};

export default bookingApi;
