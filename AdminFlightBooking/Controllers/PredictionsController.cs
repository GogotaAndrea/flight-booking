using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdminFlightBooking.Controllers
{
    // Modele de request/response simple
    public class FlightBookingInput
    {
        public string FlightNumber { get; set; } = string.Empty;
        public List<DateTime> BookingDates { get; set; } = new List<DateTime>();
    }

    public class FlightPredictionResult
    {
        public string FlightNumber { get; set; } = string.Empty;
        public int HistoricalBookings { get; set; }
        public int PredictedBookings { get; set; }
        public string Explanation { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PredictionsController : ControllerBase
    {
        // POST api/predictions
        [HttpPost]
        public ActionResult<List<FlightPredictionResult>> Post([FromBody] List<FlightBookingInput> input)
        {
            var results = new List<FlightPredictionResult>();

            foreach (var flight in input)
            {
                // 1) istoric
                var historical = flight.BookingDates?.Count ?? 0;

                if (historical == 0)
                {
                    results.Add(new FlightPredictionResult
                    {
                        FlightNumber = flight.FlightNumber,
                        HistoricalBookings = 0,
                        PredictedBookings = 0,
                        Explanation = "Fără rezervări recente — prezicerea e 0."
                    });
                    continue;
                }

                // 2) Grupăm rezervările pe săptămână calendaristică (ISO-like)
                var weeks = flight.BookingDates
                    .Select(d => new { Week = GetIsoWeekOfYear(d), Year = d.Year })
                    .GroupBy(x => (x.Year, x.Week))
                    .Select(g => new { Year = g.Key.Year, Week = g.Key.Week, Count = g.Count() })
                    .OrderBy(x => x.Year).ThenBy(x => x.Week)
                    .ToList();

                // Dacă nu sunt enough weeks, folosim media simplă
                int predicted = 0;
                string explanation = "";

                if (weeks.Count < 2)
                {
                    // fallback: media pe săptămână
                    var avg = Math.Round((double)historical / Math.Max(1, 4)); // assume 4-week window
                    predicted = (int)Math.Max(0, avg);
                    explanation = $"Date insuficiente pe săptămâni (doar {weeks.Count}). Se folosește media aproximativă: {predicted}.";
                }
                else
                {
                    // Calculăm media ultimele 4 săpt și precedentul 4 săpt (dacă există)
                    // Construim lista de counts în ordine cronologică
                    var counts = weeks.Select(w => w.Count).ToList();

                    // asigurăm că luăm ultimele 8 săptămâni când e posibil
                    var lastN = 4;
                    var lastWindow = counts.Skip(Math.Max(0, counts.Count - lastN)).ToList();
                    var prevWindow = counts.Skip(Math.Max(0, counts.Count - 2 * lastN)).Take(lastN).ToList();

                    double lastAvg = lastWindow.Count > 0 ? lastWindow.Average() : 0;
                    double prevAvg = prevWindow.Count > 0 ? prevWindow.Average() : (lastAvg > 0 ? lastAvg : 0);

                    // growth rate
                    double growthRate = prevAvg == 0 ? (lastAvg > 0 ? 1.0 : 0.0) : (lastAvg - prevAvg) / prevAvg;

                    // Predicție: luăm ultima medie și o ajustăm după trend (clamped)
                    var rawPred = lastAvg * (1.0 + Math.Clamp(growthRate, -0.5, 1.0)); // caps growth/decline
                    predicted = (int)Math.Max(0, Math.Round(rawPred));

                    explanation = $"Ultimele {lastWindow.Count} săptămâni medie={lastAvg:F2}, precedentul set medie={prevAvg:F2}, growth={growthRate:P1}. Predicție ajustată={predicted}.";
                }

                results.Add(new FlightPredictionResult
                {
                    FlightNumber = flight.FlightNumber,
                    HistoricalBookings = historical,
                    PredictedBookings = predicted,
                    Explanation = explanation
                });
            }

            return Ok(results);
        }

        // helper ISO week calculation (simple)
        private static int GetIsoWeekOfYear(DateTime date)
        {
            // using Calendar.GetWeekOfYear would require CultureInfo; this is a simple approach:
            var d = date;
            var day = (int)d.DayOfWeek;
            if (day == 0) day = 7; // make Sunday = 7
            var thursday = d.AddDays(4 - day);
            var firstDayOfYear = new DateTime(thursday.Year, 1, 1);
            var week = (int)Math.Floor((thursday - firstDayOfYear).TotalDays / 7.0) + 1;
            return Math.Max(1, week);
        }
    }
}
