import { generateUniqueTrashbinIdentifier } from '../service/trashbin';
import { Project } from '../models/project';
import { Trashbin } from '../models/trashbin';

// Modify the createTrashItem to support the adding of sensors as well once senser routes are ready
export const createTrashItem = async (req: any, res: any, next: any) => {
  try {
    const projectId = req.body.project;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (
      userRole === 'SUPERADMIN' ||
      (userRole === 'ADMIN' && project.users.includes(userId))
    ) {
      //   Create the trashbin here

      const identifer = await generateUniqueTrashbinIdentifier(projectId);
      console.log('The identifier =>', identifer);

      // Fetch location string from the longitude and latitude

      const trashbin = new Trashbin({
        identifier: identifer,
        coordinates: [longitude, latitude],
        location: '',
        project: projectId,
      });

      await trashbin.save();
      return res
        .status(200)
        .json({ message: 'Trash can created successfully' });
    } else {
      return res
        .status(403)
        .json({ message: 'Unauthorized to create trash can' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrashItemById = async (req: any, res: any, next: any) => {
  try {
    const trashbinId = req.params.id;
    const trashbin = await Trashbin.findById(trashbinId);

    if (!trashbin) {
      return res.status(404).json({ message: 'Trashbin not found' });
    }

    return res.status(200).json(trashbin);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all trash items
export const getAllTrashItems = async (req: any, res: any, next: any) => {
  try {
    const trashbins = await Trashbin.find();
    return res.status(200).json(trashbins);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
