"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const project_1 = require("../models/project");
const city_1 = require("../models/city");
const user_1 = require("../models/user");
const service_1 = require("../service");
const mongoose_1 = __importDefault(require("mongoose"));
// Get all projects a user is part of
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // Assuming user id is stored in req.user
        const userRole = req.user.role;
        let projects;
        if (userRole === 'SUPERADMIN') {
            projects = yield project_1.Project.find().populate('city');
        }
        else {
            projects = yield project_1.Project.find({ users: userId }).populate('city');
        }
        res.json({
            projectCount: projects === null || projects === void 0 ? void 0 : projects.length,
            projects,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllProjects = getAllProjects;
// Get a single project by ID
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Assuming user id is stored in req.user
        const userRole = req.user.role;
        let project;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            project = yield project_1.Project.findById(id).populate('city');
        }
        else {
            project = yield project_1.Project.findOne({ identifier: id });
        }
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Check if the user is authorized to view the project
        if (userRole !== 'SUPERADMIN' && !project.users.includes(userId)) {
            return res
                .status(403)
                .json({ message: 'Unauthorized to view this project' });
        }
        res.json({ project });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProjectById = getProjectById;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user has superadmin role
        if (req.user.role !== 'SUPERADMIN') {
            return res.status(403).send('Only superadmin can create new projects');
        }
        // Check if a project with the same name already exists
        const existingProject = yield project_1.Project.findOne({ name: req.body.name });
        if (existingProject) {
            return res
                .status(409)
                .json({ message: 'Project with this name already exists' });
        }
        // Check if the city exists
        const cityExists = yield city_1.City.findById(req.body.city);
        if (!cityExists) {
            return res.status(404).json({ message: 'City not found' });
        }
        // Check if all users exist
        const userIds = req.body.users;
        for (const userId of userIds) {
            const userExists = yield user_1.User.findById(userId);
            if (!userExists) {
                return res
                    .status(404)
                    .json({ message: `User with ID ${userId} not found` });
            }
        }
        const projectIdentifer = yield (0, service_1.generateUniqueProjectIdentifier)(req.body.city);
        // Create and save the new project
        const newProject = new project_1.Project(Object.assign(Object.assign({}, req.body), { identifier: projectIdentifer }));
        const savedProject = yield newProject.save();
        // Once the project is create we need to push the projectId to the added users user.projects array
        savedProject.users.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.User.findById(userId);
            user.projects.push(savedProject._id);
            yield user.save();
        }));
        res
            .status(201)
            .json({ message: 'Project created succesfully!', savedProject });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createProject = createProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const project = yield project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Check if the user is authorized to update the project
        const userId = req.user.id; // Assuming user id is stored in req.user
        const userRole = req.user.role;
        if (userRole !== 'SUPERADMIN' && !project.users.includes(userId)) {
            return res
                .status(403)
                .json({ message: 'Unauthorized to edit this project' });
        }
        if (req.body.city) {
            // Check if the city exists
            const cityExists = yield city_1.City.findById(req.body.city);
            if (!cityExists) {
                return res.status(404).json({ message: 'City not found' });
            }
        }
        if (((_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            // Check if all users exist
            const userIds = req.body.users;
            for (const userId of userIds) {
                const userExists = yield user_1.User.findById(userId);
                if (!userExists) {
                    return res
                        .status(404)
                        .json({ message: `User with ID ${userId} not found` });
                }
            }
        }
        const updatedProject = yield project_1.Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (((_c = updatedProject.users) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            updatedProject.users.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield user_1.User.findById(userId);
                if (!user.projects.includes(updatedProject._id)) {
                    user.projects.push(updatedProject._id);
                    yield user.save();
                }
            }));
        }
        res.json(updatedProject);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateProject = updateProject;
