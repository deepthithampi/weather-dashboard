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
    public city:string,
    public date:string,
    public icon:string,
    public weatherDescription: string,
    public temperature: number,
    public windSpeed: number,
    public humidity: number
    
    
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.weatherDescription = weatherDescription;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    
    
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

   //private baseURL: string = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}` ;
   private baseURL = process.env.API_BASE_URL || "https://api.openweathermap.org";
   private API_KEY = process.env.API_KEY;
   private city: string = "";

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
   this.city = city;
    //const query = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.API_KEY}`;
    //console.log("Value retured from API : ",query);
    return `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.API_KEY}`;
   }


  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`;
   }


  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData(city: string) {
    this.city = city;
    const locationQuery = this.buildGeocodeQuery(city);
    //console.log(locationQuery);
    const locationData = await this.fetchLocationData(locationQuery);
    this.city = locationData.name;
    // console.log("LLLLOOOCCCAAATT ",locationData);
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
    //console.log("Weather API Response (inside parseCurrentWeather):", response);
    if (!response || !response.main) {
      throw new Error("Invalid weather data format");
    }
    // Extract necessary data from the response
  //const city = response.name;//cityName;
  const date = new Date(response.dt * 1000).toLocaleDateString()||'0'; 
  const icon = response.weather[0].icon;
  const temperature = response.main.temp;
  const humidity = response.main.humidity;
  const windSpeed = response.wind.speed;
  const weatherDescription = response.weather[0].description;
    //console.log("Response from ParseCurrentWeather -> ",response);
   // const currentWeatherData = response.list[0];
    const currentWeather = new Weather(
      this.city,
      date,
      icon,
      weatherDescription,
      temperature,
      windSpeed,
      humidity
     
    );
    //console.log("Curretn weather - ParseCurrentWeather",currentWeather);
    return currentWeather;
   }


  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((entry) => {
      return new Weather(
        this.city,
        new Date(entry.dt * 1000).toLocaleDateString()||'0',
        entry.weather[0].icon,
        entry.weather[0].description,
        entry.main.temp,
        entry.wind.speed,
        entry.main.humidity
        
      );
    });
    //console.log("Inside WeatherService buildForeCastArray ",currentWeather);
    //console.log("Forcasr Array weather - buildForecastArray",forecastArray);
    //console.log("Current Weather - buildForecastArray ",currentWeather);
    return [currentWeather, ...forecastArray];
   }
   

  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string) {
   
    this.city = city;
   // console.log(city);

    const coordinates = await this.fetchAndDestructureLocationData(city);
   
    const weatherData = await this.fetchWeatherData(coordinates);   
    // console.log("AAAAAAAAAAAAAAA Weather data response inside getWeatherForCity  :", weatherData.list[0]);

    //console.log("getWeaterForCity - weather.current Humidity ",weatherData.list[0].main.humidity);
    const currentWeather = this.parseCurrentWeather(weatherData.list[0]);//,city);

     console.log("WeatherService.ts - getWeatherforCity - currentWeather ",currentWeather);

    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    //const forecasts = weatherData.list.slice(1).map((item: any) => parseForecast(item));
    //console.log("FFFFFFFFFFFFFFFFF getWeatherForCity - forecastArray() ",forecastArray);
    return [forecastArray];

}
}
export default new WeatherService();
