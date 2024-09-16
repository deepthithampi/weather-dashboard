import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
    const city = req.body.cityName;
   console.log(city);
  try{
  
    const weatherData = await WeatherService.getWeatherForCity(city);
   //const weatherDataJSON = await weatherData.json();
    console.log("Weather data response: from Weather Routes", weatherData);
    // TODO: save city to search history
    if(weatherData){
      await HistoryService.addCity(city);
      res.json({
        message : "Weather data retrieved successfully",
        data : weatherData
      });
    }else{
      res.json({ 
        message : "Weather data not found"
      });
    }
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try{
  const searchHistory = await HistoryService.getCities();
  res.json({
    message : "Search history retrieved successfully",
    history : searchHistory
}); }
catch(err){
  console.log(err);
  res.status(500).json({ message: "Server error" });
}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try{
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.json({
      message : "City removed from search history"
    });
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
