// include <WiFi.h>
//include <HTTPClient.h>

// Removed personal details, fill in your own WiFi credentials and deployed Apps Script URL below
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

const char* scriptURL = "YOUR_GOOGLE_APPS_SCRIPT_URL";

const int SOIL_PIN = 4;

// Your calibration values
const int DRY_RAW = 2630;
const int WET_RAW = 1200;

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
}

void loop() {
  int raw = analogRead(SOIL_PIN);

  int percent = 100 * (DRY_RAW - raw) / (DRY_RAW - WET_RAW);
  percent = constrain(percent, 0, 100);

  Serial.print("Raw: ");
  Serial.print(raw);
  Serial.print("  Percent: ");
  Serial.println(percent);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = String(scriptURL) + "?raw=" + raw + "&percent=" + percent;

    http.begin(url);
    int httpResponseCode = http.GET();

    Serial.print("HTTP Response: ");
    Serial.println(httpResponseCode);

    http.end();
  }

  delay(1800000); // 30 minutes
}