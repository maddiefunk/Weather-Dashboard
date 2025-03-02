import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;

  constructor(
    temperature: number,
    humidity: number,
    windSpeed: number,
    description: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(cityName: string) {
    this.baseURL ='https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5?${query}&appid=${this.apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    return data;
   }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: any): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error("Error");
    }

    const { lat: latitude, lon: longitude } = locationData[0];
    return { latitude, longitude };
   }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    const query = `q=${encodeURIComponent(this.cityName)}`;
    return query;
   }
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    const query = `lat=${latitude}&lon=${longitude}`;
    return query;
   }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
   }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${this.apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error('Error');
    }
    return await response.json();
   }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const {main, wind, weather } = response;
    return new Weather(main.temp, main.humidity, wind.speed, weather[0].description);
   }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(_currentWeather: Weather, weatherData: any): Weather[] {
    const forecastArray: Weather[] = [];

    for (const forecast of weatherData) {
      const { main, wind, weather } = forecast;
      const temperature = main.temp;
      const humidity = main.humidity;
      const windSpeed = wind.speed;
      const description = weather[0].description;

      const weatherForecast = new Weather(temperature, humidity, windSpeed, description);
      forecastArray.push(weatherForecast);
    }
    return forecastArray;
   }
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
      return { currentWeather, forecast: forecastArray };
    } catch (error) {
      console.error('Error', error);
      throw new Error('Could not retrieve weather data');
    }
   }
}

export default WeatherService;
