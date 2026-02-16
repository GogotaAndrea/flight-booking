using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using AdminFlightBooking.Models;

namespace AdminFlightBooking.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Obține toate rezervările
        public async Task<List<Booking>> GetBookingsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Booking>>("api/bookings")
                ?? new List<Booking>();
        }

        // Obține toate zborurile
        public async Task<List<Flight>> GetFlightsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Flight>>("api/flights")
                ?? new List<Flight>();
        }

        // Obține toți utilizatorii
        public async Task<List<User>> GetUsersAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<User>>("api/users")
                ?? new List<User>();
        }

        // Obține toate plățile
        public async Task<List<Payment>> GetPaymentsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Payment>>("api/payments")
                ?? new List<Payment>();
        }
    }
}
