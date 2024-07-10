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
exports.updateUser = exports.createSuperAdmin = exports.signupUser = exports.loginUser = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Compare the provided password with the hashed password in the database
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Generate a token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY || 'default_secret', // Fallback secret
        { expiresIn: '48h' });
        // Respond with user and token
        res.json({
            message: 'Logged in successfully.',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.loginUser = loginUser;
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Coming inside signup ====>');
    const { role, email, password, projects, preferences } = req.body;
    const currentUserId = req.user.id; // Assuming user ID is attached to the request by auth middleware
    const currentUserRole = req.user.role; // Assuming user role is attached to the request by auth middleware
    try {
        // Check if the current user has the right to create the specified role
        if (currentUserRole === 'ADMIN' && role !== 'USER') {
            return res
                .status(403)
                .json({ message: 'Admins can only create user type users.' });
        }
        if (currentUserRole === 'SUPERADMIN' && role === 'SUPERADMIN') {
            return res
                .status(403)
                .json({ message: 'Cannot create another SUPERADMIN.' });
        }
        console.log('Current User Id =>', currentUserId);
        console.log('Current User Role =>', currentUserRole);
        // Validate email uniqueness
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Set default preferences if not provided
        const userPreferences = preferences || {
            language: 'EN',
            themeIsDark: false,
        };
        // Create user
        const newUser = new user_1.User({
            role,
            email,
            password: hashedPassword,
            projects,
            preferences: userPreferences,
        });
        yield newUser.save();
        res
            .status(201)
            .json({ message: 'User created successfully.', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.signupUser = signupUser;
const createSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, preferences } = req.body;
    try {
        // Validate email uniqueness
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create superadmin
        const newSuperAdmin = new user_1.User({
            role: 'SUPERADMIN',
            email,
            password: hashedPassword,
            preferences,
        });
        yield newSuperAdmin.save();
        res.status(201).json({
            message: 'SuperAdmin created successfully.',
            user: newSuperAdmin,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.createSuperAdmin = createSuperAdmin;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role, email, password, projects, preferences } = req.body;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    try {
        // Fetch the user to be updated
        const userToUpdate = yield user_1.User.findById(userId);
        const currentUser = yield user_1.User.findById(currentUserId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Check if the current user has the right to update the specified user
        if (currentUserRole === 'USER' && currentUserId !== userId) {
            return res
                .status(403)
                .json({ message: 'Users can only update themselves.' });
        }
        if (currentUserRole === 'ADMIN' &&
            currentUserId !== userId &&
            !currentUser.projects.some((project) => userToUpdate.projects.includes(project))) {
            return res.status(403).json({
                message: 'Admins can only update users of their project and themselves.',
            });
        }
        // SuperAdmin can update all users, no additional checks needed
        // Validate email uniqueness if email is being updated
        if (email && email !== userToUpdate.email) {
            const existingUser = yield user_1.User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use.' });
            }
            userToUpdate.email = email;
        }
        // Hash password if it's being updated
        if (password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            userToUpdate.password = yield bcrypt_1.default.hash(password, salt);
        }
        // Update other fields
        if (role)
            userToUpdate.role = role;
        if (projects)
            userToUpdate.projects = projects;
        if (preferences)
            userToUpdate.preferences = preferences;
        yield userToUpdate.save();
        res
            .status(200)
            .json({ message: 'User updated successfully.', user: userToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.updateUser = updateUser;
