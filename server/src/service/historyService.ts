import { promises as fs } from 'fs'; 
import path from 'path';
//
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//

// TODO: Define a City class with name and id properties
class City {  
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = '../db/searchHistory.json';
  //private filePath = path.join(__dirname, '../db/searchHistory.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try{
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);

    }catch(err){
      console.log(err);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
       await fs.writeFile(this.filePath, JSON.stringify(cities));
    } catch (err) {
       console.log(err);
    }
 }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities(){//:Promise<City[]> {
    //return await this.read();
    const filePath = path.resolve('../db/searchHistory.json'); // Ensure correct path

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading search history file:", err);
      throw new Error('Failed to retrieve search history');
    }
   }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(city: string) {
    const cities = await this.read();
    const newCity = new City(city, cities.length.toString());
    cities.push(newCity);
    await this.write(cities);
   }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
   async removeCity(id: string) {
    let cities : City[] = await this.read();
    cities = cities.filter((city : City)=> city.id !== id);
    await this.write(cities);
   }
}

export default new HistoryService();
