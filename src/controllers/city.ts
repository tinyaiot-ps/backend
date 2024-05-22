import { City } from '../models/city';

export const getCityById = async (req: any, res: any) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).send('City not found');
    }
    res.json({
      message: 'City found',
      city,
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const getAllCities = async (req: any, res: any) => {
  try {
    const cities = await City.find({});

    res.json({
      message: 'Cities found',
      cities,
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const createCity = async (req: any, res: any) => {
  if (req.user.role !== 'SUPERADMIN') {
    return res.status(403).send('Only superadmin can create new cities');
  }
  try {
    const { name } = req.body;
    const existingCity = await City.findOne({ name });
    if (existingCity) {
      return res.status(409).send('City already exists');
    }
    const newCity = new City({ name });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).send('Server error');
  }
};
