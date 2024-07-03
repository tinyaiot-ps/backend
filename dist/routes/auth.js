"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Login route
router.post('/login', auth_1.loginUser);
// Signup route
router.post('/signup', authenticate_1.authenticateToken, auth_1.signupUser);
router.patch('/user', authenticate_1.authenticateToken, auth_1.updateUser);
exports.default = router;
