# 🌱 IoT Soil Moisture Monitoring – Part 1: Sensing

## Overview

This section of the project focuses on the **data collection (sensing) pipeline** for monitoring soil moisture over time using an IoT device.

An **ESP32 microcontroller** connected to a **capacitive soil moisture sensor** was used to collect real-time measurements. The data was transmitted via Wi-Fi to a **Google Sheets database** using a Google Apps Script endpoint. 

In addition to soil measurements, **hourly weather data (temperature and humidity)** was integrated from a public API to provide contextual environmental information.

---

## System Architecture

**Hardware → Network → Cloud → Storage**

- **Sensor:** Capacitive soil moisture sensor (analog output)
- **Microcontroller:** ESP32-S3
- **Communication:** Wi-Fi (HTTP requests)
- **Backend:** Google Apps Script (web app endpoint)
- **Storage:** Google Sheets
- **External Data Source:** Open-Meteo API (weather data)

---

## Data Collection Process

### Soil Moisture Sensing

- The ESP32 reads analog values from the soil moisture sensor via a GPIO pin.
- Raw sensor values are mapped to a **moisture percentage** using calibration bounds:
  - Dry soil ≈ 2630  
  - Wet soil ≈ 1200  
- The mapping is computed as:


Moisture (%) = 100 × (DRY_RAW - raw) / (DRY_RAW - WET_RAW)
Measurements are taken every 30 minutes using a fixed loop delay.

Each reading includes:
- Timestamp  
- Raw sensor value  
- Moisture percentage  

---

## Data Transmission

After each reading, the ESP32 sends data via an HTTP GET request to a deployed Google Apps Script web app.

The script appends each reading as a new row in Google Sheets with an automatic timestamp.

---

## Weather Data Integration

Weather data was collected using the Open-Meteo API.

Variables collected:
- Temperature (°C)  
- Relative humidity (%)  

Data was recorded at hourly intervals in a separate sheet.

---

## Data Alignment

Because soil data is collected every 30 minutes and weather data hourly, the two datasets were aligned in a combined dataset:

- Each soil measurement is matched with the most recent preceding weather observation  
- This is equivalent to a forward-fill alignment strategy  
- Ensures no future information is used  

---

## Dataset Description

All datasets are stored in the `/Data` folder:

### 1. `Soil Data - Soil Data.csv`

Raw sensor readings:
- Timestamp  
- RawValue  
- MoisturePercent  
- WaterAddedCups  

### 2. `Soil Data - Weather.csv`

Hourly weather data:
- `timestamp`  
- `temperature_2m_C`  
- `relative_humidity_2m_pct`  

### 3. `Soil Data - CombinedData.csv`

Merged dataset:
- Soil readings + aligned weather data  
- Each row represents a single timepoint with both sensor and environmental context  

---

## Data Collection Period

- Start: **27 Feb 2026**  
- End: **12 Mar 2026**  
- Duration: ~2 weeks of continuous measurements  

---

## Notes & Limitations

- Soil measurements begin slightly earlier than weather data, resulting in a small number of initial rows without matched weather values.  
- Sampling is performed using a fixed delay loop, resulting in consistent timestamps (e.g., `xx:02:11`, `xx:32:11`).  
- The system does not use real-time clock synchronization; timing is relative to device start.  
- Sensor readings may be affected by soil density and placement, which can influence measurement sensitivity.  

---

## Files

- `arduino_code.ino` – ESP32 data collection and transmission logic  
- `app_script_code.gs` – Google Apps Script for receiving and storing data  
- `/Data` – CSV exports of collected datasets  

---

## Summary

This sensing pipeline demonstrates:

- Reliable periodic data collection using embedded hardware  
- Real-time cloud integration via lightweight HTTP requests  
- Multi-source time series integration (sensor + external API)  

This forms the foundation for subsequent analysis and modeling.