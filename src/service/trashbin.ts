import { City } from '../models/city';
import { Project } from '../models/project';
import { Trashbin } from '../models/trashbin';

export const generateUniqueTrashbinIdentifier = async (projectId: string) => {
  const project: any = await Project.findById(projectId);
  const city = await City.findById(project.city);

  if (!city) {
    throw new Error('City not found');
  }

  const cityName = city.name;
  const formattedCityName = cityName.toLowerCase();

  // Filter by projectId before sorting
  const latestTrashbin = await Trashbin.findOne({ project: projectId }).sort({
    createdAt: -1,
  });

  const latestTrashbinCounter = latestTrashbin
    ? parseInt(latestTrashbin.identifier.split('-')[2])
    : 0;

  const counter = (latestTrashbinCounter + 1).toString().padStart(4, '0');

  return `${formattedCityName}-trashbin-${counter}`;
};
