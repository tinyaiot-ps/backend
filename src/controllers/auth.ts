import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY || 'default_secret', // Fallback secret
      { expiresIn: '48h' }
    );

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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const signupUser = async (req: any, res: any) => {
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set default preferences if not provided
    const userPreferences = preferences || {
      language: 'EN',
      themeIsDark: false,
    };

    // Create user
    const newUser = new User({
      role,
      email,
      password: hashedPassword,
      projects,
      preferences: userPreferences,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: 'User created successfully.', user: newUser });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSuperAdmin = async (req: any, res: any) => {
  const { email, password, preferences } = req.body;

  try {
    // Validate email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create superadmin
    const newSuperAdmin = new User({
      role: 'SUPERADMIN',
      email,
      password: hashedPassword,
      preferences,
    });

    await newSuperAdmin.save();

    res.status(201).json({
      message: 'SuperAdmin created successfully.',
      user: newSuperAdmin,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUser = async (req: any, res: any) => {
  const { userId, role, email, password, projects, preferences } = req.body;
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    // Fetch the user to be updated
    const userToUpdate: any = await User.findById(userId);
    const currentUser: any = await User.findById(currentUserId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the current user has the right to update the specified user
    if (currentUserRole === 'USER' && currentUserId !== userId) {
      return res
        .status(403)
        .json({ message: 'Users can only update themselves.' });
    }

    if (
      currentUserRole === 'ADMIN' &&
      currentUserId !== userId &&
      !currentUser.projects.some((project: any) =>
        userToUpdate.projects.includes(project)
      )
    ) {
      return res.status(403).json({
        message:
          'Admins can only update users of their project and themselves.',
      });
    }

    // SuperAdmin can update all users, no additional checks needed

    // Validate email uniqueness if email is being updated
    if (email && email !== userToUpdate.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
      userToUpdate.email = email;
    }

    // Hash password if it's being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    // Update other fields
    if (role) userToUpdate.role = role;
    if (projects) userToUpdate.projects = projects;
    if (preferences) userToUpdate.preferences = preferences;

    await userToUpdate.save();

    res
      .status(200)
      .json({ message: 'User updated successfully.', user: userToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
