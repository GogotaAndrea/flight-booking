using System;

namespace AdminFlightBooking.Models
{
    public class Payment
    {
        public long Id { get; set; }
        public Booking? Booking { get; set; }
        public double Amount { get; set; }
        public string? Method { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? Status { get; set; }
    }
}
