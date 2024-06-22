import { Project } from '../models/project';
import { City } from '../models/city';

export const generateUniqueProjectIdentifier = async (cityId: string) => {
  const city = await City.findById(cityId);

  if (!city) {
    return null;
  }

  const latestProject = await Project.findOne().sort({
    createdAt: -1,
  });

  let latestProjectCounter = 0;
  if (latestProject && latestProject.identifier) {
    const parts = latestProject.identifier.split('-');
    if (parts.length === 3 && !isNaN(parseInt(parts[2]))) {
      latestProjectCounter = parseInt(parts[2]);
    }
  }

  const counter = (latestProjectCounter + 1).toString().padStart(4, '0');

  return `${city.name.toLowerCase()}-project-${counter}`;
};
