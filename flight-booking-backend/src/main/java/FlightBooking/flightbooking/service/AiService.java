package FlightBooking.flightbooking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AiService {

    @Value("${ollama.base-url}")
    private String ollamaBase;

    @Value("${ollama.generate-path}")
    private String generatePath;

    @Value("${ollama.model}")
    private String modelName;

    private final RestTemplate rest = new RestTemplate();

    /**
     * Send a prompt to Ollama generate and return the text output.
     * We set stream: false in body options so we get a single response object.
     */
    public String predictPriceForFlight(Long flightId, Map<String,Object> contextData) {
        String url = ollamaBase + generatePath;

        // Build a plain prompt. You may enrich with historical data from DB and include it in contextData.
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert travel pricing model. ");
        prompt.append("Given this flight context, propose a plausible near-future price (single number) and a short rationale.\n\n");
        prompt.append("Flight context:\n");
        prompt.append("flightId: ").append(flightId).append("\n");

        if (contextData != null && !contextData.isEmpty()) {
            prompt.append("Context data (JSON): ").append(contextData.toString()).append("\n");
        }

        prompt.append("\nReturn JSON like: { \"predictedPrice\": 123.45, \"currency\": \"USD\", \"confidence\": \"low|medium|high\", \"rationale\": \"...\" }");

        // Ollama expects { model, prompt, stream?: boolean, ... }
        Map<String, Object> body = Map.of(
                "model", modelName,
                "prompt", prompt.toString(),
                "stream", false
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> resp = rest.postForEntity(url, request, Map.class);

        if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            // Response shape from Ollama generate varies; often the text is under "completion" or "result" fields.
            // We'll try to read common places, otherwise return raw toString().
            Map<String, Object> map = resp.getBody();

            // Try common field "text" or "completion" or "output"
            Object text = map.getOrDefault("text", map.get("completion"));
            if (text == null) text = map.get("output");
            if (text == null) {
                // fallback: return entire response as string
                return map.toString();
            } else {
                return text.toString();
            }
        } else {
            return "AI service error: " + resp.getStatusCode();
        }
    }
}
