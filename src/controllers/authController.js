const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({
            success: true,
            userId: user._id,
            message: 'User registered successfully',
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user) {
        res.json({
            id: user._id,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    const { username, bio, profilePicture } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.username = username || user.username;
            user.bio = bio || user.bio;
            user.profilePicture = profilePicture || user.profilePicture;
            await user.save();
            res.json({ success: true, message: 'Profile updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
