import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  
  constructor(
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public weatherDescription: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.weatherDescription = weatherDescription;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

   //private baseURL: string = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}` ;
   private baseURL = process.env.API_BASE_URL || "https://api.openweathermap.org";
   private API_KEY = process.env.API_KEY;
  // private city: string = "";
  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    const response = await fetch(query);
    //console.log(response);
    const data = await response.json();
    return data;
   }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    
    return { lat, lon };
   }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(city : string): string {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}`;
   }
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`;
   }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData(city: string) {
    const locationQuery = this.buildGeocodeQuery(city);
    //console.log(locationQuery);
    const locationData = await this.fetchLocationData(locationQuery);
   // console.log(locationData);
    return this.destructureLocationData(locationData.coord);
   }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    //console.log(weatherQuery);
    return await this.fetchLocationData(weatherQuery);
   }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    console.log("Weather API Response (inside parseCurrentWeather):", response);
    if (!response || !response.main) {
      throw new Error("Invalid weather data format");
    }
    //console.log(response);
    const currentWeather = new Weather(
      response.main.temp,
      response.main.humidity,
      response.wind.speed,
      response.weather[0].description
    );
    console.log("Curretn weather",currentWeather);
    return currentWeather;
   }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((entry) => {
      return new Weather(
        entry.main.temp,
        entry.main.humidity,
        entry.wind.speed,
        entry.weather[0].description
      );
    });
    console.log("Inside WeatherService buildForeCastArray ",currentWeather);
    console.log("Forcasr Array weather",forecastArray);
    return [currentWeather, ...forecastArray];
   }
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string) {
   
    // this.city = city;
    console.log(city);

    const coordinates = await this.fetchAndDestructureLocationData(city);
   //const locationQuery = this.buildGeocodeQuery(city);
   // const locationData = await this.fetchLocationData(locationQuery);
    // const coordinates = this.destructureLocationData(locationData.coord);

    //const weatherQuery = this.buildWeatherQuery(coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log("Weather data response inside getWeatherForCity WeratherService.ts :", weatherData);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return forecastArray;

}
}
export default new WeatherService();
