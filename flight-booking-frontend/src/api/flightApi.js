import axiosClient from "./axiosClient";

const flightApi = {
  getAll: () => axiosClient.get("/flights"),
  getById: (id) => axiosClient.get(`/flights/${id}`),
};

export default flightApi;
