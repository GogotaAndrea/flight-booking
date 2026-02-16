using AdminFlightBooking.Services;

var builder = WebApplication.CreateBuilder(args);

// Adaugă serviciile Blazor și Razor Pages
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// HttpClient backend (zboruri / rezervări)
builder.Services.AddHttpClient<ApiService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8080/");
});

// HttpClient pentru Ollama
builder.Services.AddHttpClient<AiService>(client =>
{
    // Ollama rulează local pe portul 11434
    client.BaseAddress = new Uri("http://127.0.0.1:11434");
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();                // Blazor Server
app.MapFallbackToPage("/_Host");   // fallback pentru paginile Razor

app.Run();
