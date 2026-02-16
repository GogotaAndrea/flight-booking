import axiosClient from "./axiosClient";

const paymentApi = {
  getAll: () => axiosClient.get("/payments"),
  getById: (id) => axiosClient.get(`/payments/${id}`),
  create: (data) => axiosClient.post("/payments", data),
};

export default paymentApi;
