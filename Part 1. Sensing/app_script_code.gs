
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const raw = e.parameter.raw || "";
  const percent = e.parameter.percent || "";

  sheet.appendRow([new Date(), raw, percent]);

  return ContentService.createTextOutput("OK");
}

function fetchCurrentWeatherHour() {
  const sheetName = "weather";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp", "temperature_2m_C", "relative_humidity_2m_pct"]);
  }

  const latitude = 51.5074;
  const longitude = -0.1278;

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + latitude +
    "&longitude=" + longitude +
    "&hourly=temperature_2m,relative_humidity_2m" +
    "&timezone=Europe%2FLondon" +
    "&forecast_days=1";

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;
  const humidity = data.hourly.relative_humidity_2m;

  const now = new Date();
  const nowHour = Utilities.formatDate(now, "Europe/London", "yyyy-MM-dd'T'HH:00");

  let idx = times.indexOf(nowHour);
  if (idx === -1) {
    idx = 0;
    for (let i = 0; i < times.length; i++) {
      if (times[i] <= nowHour) idx = i;
    }
  }

  const timestamp = new Date(times[idx]);

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const lastTimestamp = sheet.getRange(lastRow, 1).getValue();
    const lastTimestampText =
      lastTimestamp instanceof Date
        ? Utilities.formatDate(lastTimestamp, "Europe/London", "yyyy-MM-dd'T'HH:00")
        : String(lastTimestamp);

    if (lastTimestampText === timestamp) {
      return;
    }
  }

  sheet.appendRow([timestamp, temps[idx], humidity[idx]]);
}