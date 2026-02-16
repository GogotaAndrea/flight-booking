using System;

namespace AdminFlightBooking.Models
{
    public class Booking
    {
        public long Id { get; set; }
        public User? User { get; set; }
        public Flight? Flight { get; set; }
        public DateTime BookingDate { get; set; }
        public string? SeatNumber { get; set; }
        public string? Status { get; set; }
    }
}
