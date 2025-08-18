import cloudinary from '../config/cloudinary.js';
import User from '../models/userModel.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const updateProfile = async (req, res) => {
    const profileFields = { ...req.body };
    try {
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'profile_pictures' },
                    (error, result) => {
                        if (error) reject(error); else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            profileFields.profilePicture = result.secure_url;
        }
        const user = await User.findByIdAndUpdate(req.user.id, { $set: profileFields }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};