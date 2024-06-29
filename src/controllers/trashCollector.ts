import { Trashbin } from '../models/trashbin';
import { TrashCollector } from '../models/trashcollector';
import { ObjectId } from 'mongoose';

export const assignTrashbinsToTrashCollector = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const userRole = req.user.role;

    if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
      const { assignedTrashbins, trashCollector } = req.body;

      if (!trashCollector) {
        return res.status(400).json({ message: 'Trash collector is required' });
      }

      const existingTrashCollector = await TrashCollector.findOne({
        _id: trashCollector,
      });
      if (!existingTrashCollector) {
        return res
          .status(400)
          .json({ message: 'Trash collector does not exist' });
      }

      if (!assignedTrashbins || !Array.isArray(assignedTrashbins)) {
        return res.status(400).json({ message: 'Invalid trashbins data' });
      }

      // Find trashbins that are currently assigned but not in the new list
      const trashbinsToUnassign =
        existingTrashCollector.assignedTrashbins.filter(
          (id: any) => !assignedTrashbins.includes(id)
        );

      // Unassign trashbins that are no longer assigned
      await Trashbin.updateMany(
        { _id: { $in: trashbinsToUnassign } },
        { $unset: { assignee: '' } }
      );

      // Assign each trashbin to the trash collector
      for (const trashbinId of assignedTrashbins) {
        const trashbin = await Trashbin.findById(trashbinId);
        if (!trashbin) {
          return res
            .status(400)
            .json({ message: `Trashbin with ID ${trashbinId} does not exist` });
        }
        trashbin.assignee = existingTrashCollector._id as any;
        await trashbin.save();
      }

      // Update the assignedTrashbins array of the trash collector
      existingTrashCollector.assignedTrashbins = assignedTrashbins;
      await existingTrashCollector.save();

      return res
        .status(200)
        .json({ message: 'Trash bins assigned successfully' });
    } else {
      return res.status(403).json({
        message:
          'Unauthorized to assign trashbins to trashcollector, should be admin or superadmin',
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTrashCollector = async (req: any, res: any, next: any) => {
  try {
    const userRole = req.user.role;

    if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
      const { name, assignedTrashbins } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const existingTrashCollector = await TrashCollector.findOne({ name });
      if (existingTrashCollector) {
        return res.status(400).json({
          message: 'A trash collector with the same name already exists',
        });
      }

      if (!assignedTrashbins) {
        req.body.assignedTrashbins = []; // Set assignedTrashbins to an empty array if not provided
      } else if (!Array.isArray(assignedTrashbins)) {
        return res
          .status(400)
          .json({ message: 'Assigned trashbins must be an array' });
      }

      // Check if all assigned trashbins exist in the database
      const allTrashbinsExist =
        assignedTrashbins?.length > 0 &&
        assignedTrashbins.every(async (trashbinId: string) => {
          const trashbin = await Trashbin.findById(trashbinId);
          return trashbin !== null;
        });

      console.log('All Trashbins exists =>', allTrashbinsExist);

      if (assignedTrashbins?.length > 0 && !allTrashbinsExist) {
        return res
          .status(400)
          .json({ message: 'One or more assigned trashbins do not exist' });
      }

      const newTrashCollector = new TrashCollector({
        name,
        assignedTrashbins,
      });

      await newTrashCollector.save();

      await Trashbin.updateMany(
        { _id: { $in: assignedTrashbins } },
        { assignee: newTrashCollector._id }
      );

      return res
        .status(201)
        .json({ message: 'Trash collector created successfully' });
    } else {
      return res.status(403).json({
        message: 'Unauthorized to create trashcollector',
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
