import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/weather', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const { city } = req.body;

  if(!city) {
    return res.status(400).json({ error: 'City name required' });
  }
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    HistoryService.saveCityToHistory(city);
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get weather data' });
  }

});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.fetchSearchHistory();
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    HistoryService.deleteCityFromHistory(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
