# IoT Soil Moisture Monitoring

## Overview

This project monitors the soil moisture of an indoor basil plant using a custom IoT sensing pipeline, paired with publicly available weather data. The goal was to explore whether continuous real-time soil data could form the foundation for a more engaging, personalised plant care experience.

The project has two parts:
- **Part 1: Sensing** — ESP32 hardware, data collection pipeline, cloud storage
- **Part 2: IoT & Analytics** — interactive web dashboard and time series analysis

---

## Live Dashboard

**View the dashboard here:** [https://lucie-pasquier.github.io/iot-soil-moisture-project/Part_2_Reporting/dashboard.html]

No installation needed — opens directly in your browser.

---

## Repository Structure
```
├── Part_1_Sensing/
│   ├── arduino_code.ino        # ESP32 firmware
│   ├── app_script_code.gs      # Google Apps Script endpoint
│   └── Data/
│       ├── Soil Data - Soil Data.csv
│       ├── Soil Data - Weather.csv
│       └── Soil Data - CombinedData.csv
├── Part_2_Reporting/
│   ├── dashboard.html          # Interactive dashboard
│   ├── CombinedData.csv        # Dataset used by dashboard
│   └── data_analysis.ipynb     # Pearson correlation analysis
└── .gitignore
```

---

## How to Run

### View the dashboard
Open the live link above. No setup required.

To run locally instead:
```bash
cd Part_2_Reporting
python3 -m http.server 8000
```
Then open `http://localhost:8000/dashboard.html` in your browser.

### Run the data analysis notebook
```bash
cd Part_2_Reporting
jupyter notebook data_analysis.ipynb
```
Requires Python with `pandas` installed (`pip install pandas`).

### Arduino firmware
Open `arduino_code.ino` in the Arduino IDE. Requires the ESP32 board package installed. Update WiFi credentials and Apps Script URL before flashing.

---

## System Architecture

**Sensor → ESP32-S3 → WiFi (HTTP GET) → Google Apps Script → Google Sheets**

**Open-Meteo API → Google Apps Script (scheduled hourly) → Google Sheets**

- Soil moisture sampled every **30 minutes**
- Weather data collected every **60 minutes**
- Datasets aligned via forward-fill in the CombinedData tab

---

## Data Collection Period

**27 Feb 2026 to 12 Mar 2026** (~2 weeks, ~700 soil readings, ~360 weather records)

---

## Key Findings

| Metric | Value |
|--------|-------|
| Average moisture | 63.4% |
| Moisture range | 40.9% – 82.1% |
| Watering events | 4 (every ~4 days) |
| Moisture vs Temperature (Pearson r) | -0.10 |
| Moisture vs Humidity (Pearson r) | -0.19 |

Weak correlations confirm that outdoor weather is a poor proxy for indoor plant moisture dynamics.