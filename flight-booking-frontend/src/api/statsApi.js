import axiosClient from "./axiosClient";

const statsApi = {
  getMostPopularFlights: () => axiosClient.get("/bookings/most-popular"),
  getCancelledBookings: () => axiosClient.get("/bookings/cancelled"),
};

export default statsApi;
