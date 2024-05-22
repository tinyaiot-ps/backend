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
      process.env.JWT_SECRET || 'default_secret', // Fallback secret
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
  const { role, email, password, projects, preferences } = req.body;
  // const currentUserId = req.user.id; // Assuming user ID is attached to the request by auth middleware
  // const currentUserRole = req.user.role; // Assuming user role is attached to the request by auth middleware

  try {
    // Check if the current user has the right to create the specified role
    // if (currentUserRole === 'ADMIN' && role !== 'USER') {
    //   return res
    //     .status(403)
    //     .json({ message: 'Admins can only create user type users.' });
    // }
    // if (currentUserRole === 'SUPERADMIN' && role === 'SUPERADMIN') {
    //   return res
    //     .status(403)
    //     .json({ message: 'Cannot create another SUPERADMIN.' });
    // }

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

    // Optionally, create a token or perform other post-creation actions

    res
      .status(201)
      .json({ message: 'User created successfully.', user: newUser });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
