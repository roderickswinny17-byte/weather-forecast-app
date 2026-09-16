"use client";

import { useEffect, useMemo, useState } from "react";
import { Cloud, Droplets, Eye, Gauge, Moon, Search, Sun, Wind } from "lucide-react";

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

const WEATHER_ICONS: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
};

type SkyCategory = "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

function classifySky(code: number): SkyCategory {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code === 51 || code === 53 || code === 55) return "drizzle";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "rain";
  if (code === 71 || code === 73 || code === 75) return "snow";
  if (code === 95) return "storm";
  return "cloudy";
}

const SKY_BACKGROUNDS: Record<SkyCategory, string> = {
  clear: "bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 dark:from-[#03050f] dark:via-[#0b1230] dark:to-[#1b2a52]",
  cloudy: "bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 dark:from-[#0a0e1a] dark:via-[#161d31] dark:to-[#232b42]",
  fog: "bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100 dark:from-[#0c0e12] dark:via-[#1a1d24] dark:to-[#272b33]",
  drizzle: "bg-gradient-to-b from-slate-400 via-slate-300 to-sky-200 dark:from-[#080c17] dark:via-[#111c33] dark:to-[#16233f]",
  rain: "bg-gradient-to-b from-slate-500 via-slate-400 to-slate-300 dark:from-[#05070c] dark:via-[#0c111c] dark:to-[#161d29]",
  snow: "bg-gradient-to-b from-sky-100 via-blue-50 to-white dark:from-[#0a0d1c] dark:via-[#161a33] dark:to-[#242a4d]",
  storm: "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-500 dark:from-black dark:via-[#1a0b2e] dark:to-[#150a24]",
};

const STAR_DENSITY: Record<SkyCategory, number> = {
  clear: 90,
  snow: 70,
  cloudy: 45,
  drizzle: 30,
  fog: 10,
  rain: 15,
  storm: 8,
};

const CLOUD_DENSITY: Record<SkyCategory, number> = {
  clear: 0,
  cloudy: 5,
  fog: 4,
  drizzle: 5,
  rain: 6,
  snow: 4,
  storm: 6,
};

const RAIN_DENSITY: Record<SkyCategory, number> = {
  clear: 0,
  cloudy: 0,
  fog: 0,
  drizzle: 40,
  rain: 90,
  snow: 0,
  storm: 110,
};

type Star = { top: number; left: number; size: number; duration: number; delay: number };

function Starfield({ count }: { count: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.8 + 0.8,
        duration: Math.random() * 3 + 2.5,
        delay: Math.random() * 5,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

type CloudPuff = { top: number; size: number; duration: number; delay: number; opacity: number };

function Clouds({ count }: { count: number }) {
  const puffs = useMemo<CloudPuff[]>(
    () =>
      Array.from({ length: count }, () => ({
        top: Math.random() * 45 + 5,
        size: Math.random() * 70 + 70,
        duration: Math.random() * 40 + 35,
        delay: -Math.random() * 60,
        opacity: Math.random() * 0.35 + 0.45,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {puffs.map((c, i) => (
        <Cloud
          key={i}
          fill="currentColor"
          className="cloud-puff absolute text-white/90 dark:text-slate-400/40"
          style={{
            top: `${c.top}%`,
            width: c.size,
            height: c.size,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

type Raindrop = { left: number; length: number; duration: number; delay: number; opacity: number };

function Rain({ count }: { count: number }) {
  const drops = useMemo<Raindrop[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        length: Math.random() * 14 + 10,
        duration: Math.random() * 0.5 + 0.4,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.35 + 0.25,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {drops.map((d, i) => (
        <span
          key={i}
          className="raindrop absolute w-px bg-sky-100 dark:bg-sky-300"
          style={{
            left: `${d.left}%`,
            height: `${d.length}px`,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const QUICK_CITIES = ["London", "Tokyo", "New York", "Dubai", "Paris"];

type CurrentWeather = {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
  surface_pressure: number;
  is_day: number;
};

type WeatherData = {
  current: CurrentWeather;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  hourly: {
    time: string[];
    visibility: number[];
  };
};

async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,surface_pressure,is_day&daily=temperature_2m_max,temperature_2m_min&hourly=visibility&timezone=auto`;

  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}

async function getCityCoordinates(city: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const res = await fetch(url);

  if (!res.ok) return null;

  const data = await res.json();

  return data.results?.[0] ?? null;
}

function visibilityAt(data: WeatherData): number | null {
  const index = data.hourly.time.indexOf(data.current.time);
  const meters = data.hourly.visibility[index === -1 ? 0 : index];
  return meters == null ? null : meters / 1000;
}

export default function Home() {
  const [city, setCity] = useState("New York");
  const [country, setCountry] = useState("US");
  const [searchCity, setSearchCity] = useState("New York");
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    handleSearch("New York");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(cityOverride?: string) {
    const query = cityOverride ?? searchCity;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const location = await getCityCoordinates(query);

    if (!location) {
      setError("City not found");
      setLoading(false);
      return;
    }

    const weather = await getWeatherData(location.latitude, location.longitude);

    if (!weather) {
      setError("Failed to load weather data");
      setLoading(false);
      return;
    }

    setData(weather);
    setCity(location.name);
    setCountry(location.country_code ?? location.country ?? "");
    setSearchCity(location.name);
    setLoading(false);
  }

  const current = data?.current;
  const skyCategory = current ? classifySky(current.weather_code) : "clear";
  const skyBackground = current ? SKY_BACKGROUNDS[skyCategory] : "bg-background";
  const isDaytime = current ? current.is_day === 1 : true;
  const high = data?.daily.temperature_2m_max[0];
  const low = data?.daily.temperature_2m_min[0];
  const visibility = data ? visibilityAt(data) : null;
  const updated = current
    ? new Date(current.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  return (
    <div className={`relative isolate min-h-screen overflow-hidden text-foreground transition-colors duration-700 ${skyBackground}`}>
      {darkMode && <Starfield count={STAR_DENSITY[skyCategory]} />}

      {skyCategory === "clear" && !isDaytime && (
        <div className="absolute top-24 right-10 -z-10 h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[0_0_70px_20px_rgba(226,232,240,0.35)] pointer-events-none" />
      )}

      {skyCategory === "clear" && isDaytime && (
        <div className="absolute top-24 right-10 -z-10 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 shadow-[0_0_80px_25px_rgba(251,191,36,0.55)] pointer-events-none" />
      )}

      {CLOUD_DENSITY[skyCategory] > 0 && <Clouds count={CLOUD_DENSITY[skyCategory]} />}

      {RAIN_DENSITY[skyCategory] > 0 && <Rain count={RAIN_DENSITY[skyCategory]} />}

      {skyCategory === "storm" && (
        <div className="lightning absolute inset-0 -z-10 bg-white pointer-events-none" />
      )}

      <header className="relative border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="font-semibold">Weather Dashboard</span>
          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 border border-border hover:bg-accent transition-colors"
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-2">
          Weather
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Real-time forecasting powered by open meteorology APIs.
        </p>

        {/* Search Input Controls */}
        <div className="w-full max-w-md flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-background/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-4 h-10 rounded-lg bg-foreground text-background font-medium hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Quick Location Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {QUICK_CITIES.map((name) => (
            <button
              key={name}
              onClick={() => handleSearch(name)}
              className="px-3 py-1 rounded-full text-xs font-medium border border-border bg-background/30 backdrop-blur-sm hover:bg-background/80 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>

        {/* Error Feedback Banner */}
        {error && (
          <div className="w-full max-w-md p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {/* Main Application Content Grid */}
        {current && data && (
          <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Main Weather Card */}
            <div className="w-full rounded-2xl border border-border bg-background/40 backdrop-blur-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                  {city} <span className="text-sm font-semibold opacity-60 uppercase">{country}</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Updated at {updated}</p>
                <div className="mt-4 text-5xl font-extrabold tracking-tight">
                  {Math.round(current.temperature_2m)}°C
                </div>
                <p className="text-sm font-medium mt-2 flex items-center justify-center md:justify-start gap-2">
                  <span>Feels like {Math.round(current.apparent_temperature)}°C</span>
                  {high !== undefined && low !== undefined && (
                    <span className="opacity-60">· H: {Math.round(high)}° L: {Math.round(low)}°</span>
                  )}
                </p>
              </div>

              <div className="text-center">
                <span className="text-7xl block select-none drop-shadow-md animate-bounce duration-1000">
                  {WEATHER_ICONS[current.weather_code] ?? "🌡️"}
                </span>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-foreground/5 text-foreground/80 border border-foreground/10">
                  {WEATHER_CODES[current.weather_code] ?? "Unknown"}
                </span>
              </div>
            </div>

            {/* Metrics Extended Detailed Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <div className="rounded-xl border border-border bg-background/30 backdrop-blur-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Wind className="size-4" /> Wind Speed
                </div>
                <div className="text-lg font-bold mt-auto">{current.wind_speed_10m} <span className="text-xs font-normal">km/h</span></div>
              </div>

              <div className="rounded-xl border border-border bg-background/30 backdrop-blur-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Droplets className="size-4" /> Humidity
                </div>
                <div className="text-lg font-bold mt-auto">{current.relative_humidity_2m}%</div>
              </div>

              <div className="rounded-xl border border-border bg-background/30 backdrop-blur-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Gauge className="size-4" /> Pressure
                </div>
                <div className="text-lg font-bold mt-auto">{Math.round(current.surface_pressure)} <span className="text-xs font-normal">hPa</span></div>
              </div>

              <div className="rounded-xl border border-border bg-background/30 backdrop-blur-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Eye className="size-4" /> Visibility
                </div>
                <div className="text-lg font-bold mt-auto">
                  {visibility !== null ? `${visibility.toFixed(1)} km` : "N/A"}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/30 backdrop-blur-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Droplets className="size-4 text-blue-400" /> Precipitation
                </div>
                <div className="text-lg font-bold mt-auto">{current.precipitation} <span className="text-xs font-normal">mm</span></div>
              </div>

              <div className="rounded-xl border border-border bg-background/30 backdrop-blur-md p-4 flex flex-col justify-center items-center">
                <button
                  onClick={() => setShowRawJson((v) => !v)}
                  className="w-full h-full text-center text-xs font-semibold hover:underline"
                >
                  {showRawJson ? "Hide Raw Data" : "Inspect Raw JSON"}
                </button>
              </div>
            </div>

            {/* Hidden Raw Diagnostic Data Feed */}
            {showRawJson && (
              <div className="w-full rounded-xl border border-border bg-[#090d16] text-[#39ea82] p-4 font-mono text-xs overflow-x-auto shadow-inner max-h-60">
                <pre>
                  {JSON.stringify(
                    {
                      city,
                      country,
                      temperature: Math.round(current.temperature_2m * 100) / 100,
                      feels_like: Math.round(current.apparent_temperature * 100) / 100,
                      temp_min: low !== undefined ? Math.round(low * 100) / 100 : null,
                      temp_max: high !== undefined ? Math.round(high * 100) / 100 : null,
                      description: WEATHER_CODES[current.weather_code]?.toLowerCase() ?? "unknown",
                      humidity: current.relative_humidity_2m,
                      wind_speed: Math.round(current.wind_speed_10m * 100) / 100,
                      pressure: Math.round(current.surface_pressure),
                      visibility: visibility !== null ? Math.round(visibility) : null,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
