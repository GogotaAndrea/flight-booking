using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using AdminFlightBooking.Models;

namespace AdminFlightBooking.Services
{
    public class AiService
    {
        private readonly HttpClient _http;

        public AiService(HttpClient http)
        {
            _http = http;
        }

        public class FlightPredictionResult
        {
            public string FlightNumber { get; set; } = "";
            public int HistoricalBookings { get; set; }
            public int PredictedBookings { get; set; }
            public string Explanation { get; set; } = "";
        }

        public async Task<List<FlightPredictionResult>> GetFlightPredictionsAsync(List<Flight> flights, List<Booking> bookings)
        {
            var results = new List<FlightPredictionResult>();

            foreach (var f in flights)
            {
                var validBookings = bookings.FindAll(b => b.Flight?.Id == f.Id && b.Status != "CANCELLED");
                int currentCount = validBookings.Count;

                var userPrompt = $@"
Ești un model AI care analizează date de zboruri și face previziuni clare și concise.

Zborul are următoarele detalii:
- Număr zbor: {f.FlightNumber}
- Companie: {f.Airline}
- Aeroport plecare: {f.DepartureAirport}
- Aeroport sosire: {f.ArrivalAirport}
- Rezervări istorice: {currentCount}

Prezice numărul de rezervări viitoare, ținând cont de tendințele posibile ale cererii.
Răspunde DOAR în format JSON, exact așa:

{{
  ""PredictedBookings"": <număr între 0 și 200>,
  ""Explanation"": ""<scurt motiv logic, maxim 20 de cuvinte, fără politețuri>""
}}
";

                var requestBody = new
                {
                    model = "llama3.2",
                    stream = false,
                    messages = new[]
                    {
                        new { role = "system", content = "Ești un analist AI care face previziuni realiste pentru rezervări de zboruri." },
                        new { role = "user", content = userPrompt }
                    }
                };

                try
                {
                    var response = await _http.PostAsJsonAsync("/api/chat", requestBody);
                    response.EnsureSuccessStatusCode();

                    var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                    string text = json.GetProperty("message").GetProperty("content").GetString() ?? "";

                    int predicted = currentCount;
                    string explanation = "";

                    // 🧠 Extragem JSON curat dacă apare în text
                    var match = Regex.Match(text, @"\{[^}]+\}");
                    if (match.Success)
                    {
                        var cleanJson = match.Value;

                        try
                        {
                            using var doc = JsonDocument.Parse(cleanJson);
                            if (doc.RootElement.TryGetProperty("PredictedBookings", out var pb))
                                predicted = pb.GetInt32();
                            if (doc.RootElement.TryGetProperty("Explanation", out var ex))
                                explanation = ex.GetString() ?? "";
                        }
                        catch
                        {
                            // fallback dacă JSON-ul e corupt
                            explanation = text;
                        }
                    }
                    else
                    {
                        // fallback dacă nu e JSON deloc
                        foreach (var word in text.Split(' '))
                            if (int.TryParse(word, out int n))
                            {
                                predicted = n;
                                break;
                            }
                        explanation = text;
                    }

                    predicted = Math.Clamp(predicted, 0, 200);

                    results.Add(new FlightPredictionResult
                    {
                        FlightNumber = f.FlightNumber,
                        HistoricalBookings = currentCount,
                        PredictedBookings = predicted,
                        Explanation = explanation
                    });
                }
                catch (HttpRequestException httpEx)
                {
                    results.Add(new FlightPredictionResult
                    {
                        FlightNumber = f.FlightNumber,
                        HistoricalBookings = currentCount,
                        PredictedBookings = currentCount,
                        Explanation = "Eroare la comunicarea cu Ollama: " + httpEx.Message
                    });
                }
            }

            return results;
        }
    }
}
