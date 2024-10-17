import type { City } from "@/hooks/use-cities";
import type { ScaleKind } from "@/hooks/use-scale";

const celsiusToFahrenheit = (tempC: number) =>
    ((tempC * 9) / 5 + 32).toFixed(2);

const mpsToMph = (speedMps: number) => (speedMps * 2.23694).toFixed(2);

// mapbox lives outside of React and whilst more elegant solutions can be devised,
// I chose this one for now, which is to generate popup HTML on the fly.
export const generateWeatherPopupContent = (city: City, scale: ScaleKind) => {
    if (!city.weather) {
        return `<div class="p-4 max-w-xs text-gray-600 dark:text-gray-300">
            Failed to get weather-data for ${city.name}
        </div>`;
    }

    const isImperial = scale === "F";
    const temperatureUnit = isImperial ? "°F" : "°C";
    const speedUnit = isImperial ? "mph" : "m/s";

    // note: inelegant to have `weather.weather`, so probably
    // change the outermost property to `weatherData` or similar.
    const weather = city.weather.weather[0];
    const main = city.weather.main;
    const wind = city.weather.wind;
    const clouds = city.weather.clouds;

    const temp = isImperial
        ? celsiusToFahrenheit(main.temp)
        : main.temp.toFixed(2);
    const feelsLike = isImperial
        ? celsiusToFahrenheit(main.feels_like)
        : main.feels_like.toFixed(2);
    const tempMin = isImperial
        ? celsiusToFahrenheit(main.temp_min)
        : main.temp_min.toFixed(2);
    const tempMax = isImperial
        ? celsiusToFahrenheit(main.temp_max)
        : main.temp_max.toFixed(2);

    const windSpeed = isImperial ? mpsToMph(wind.speed) : wind.speed.toFixed(2);

    return `
    <div class="p-4 max-w-xs text-gray-600 dark:text-gray-300">
      <h1 class="text-xl">${city.name}</h1>
      ${
          city.population
              ? `<p>${city.population.toLocaleString()} inhabitants</p>`
              : ""
      }
      <hr class="m-1" />
      <div class="flex items-center">
        <img src="https://openweathermap.org/img/wn/${
            weather.icon
        }@2x.png" alt="Weather icon" class="w-12 h-12">
        <div class="ml-4">
          <h2 class="text-xl font-semibold">${weather.main}</h2>
          <p class="text-sm text-gray-600 capitalize">${weather.description}</p>
        </div>
      </div>
      <div class="mt-4">
        <p>
          <span class="text-2xl font-bold text-gray-600 dark:text-gray-300">${temp}${temperatureUnit}</span>
          <span class="text-sm font-normal text-gray-600 dark:text-gray-300">(Feels like ${feelsLike}${temperatureUnit})</span>
        </p>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
        <div>
          <p><span class="font-medium">Min:</span> ${tempMin}${temperatureUnit}</p>
          <p><span class="font-medium">Max:</span> ${tempMax}${temperatureUnit}</p>
          <p><span class="font-medium">Humidity:</span> ${main.humidity}%</p>
        </div>
        <div>
          <p><span class="font-medium">Wind:</span> ${windSpeed} ${speedUnit}</p>
          <p><span class="font-medium">Clouds:</span> ${clouds.all}%</p>
        </div>
      </div>
    </div>
  `;
};
