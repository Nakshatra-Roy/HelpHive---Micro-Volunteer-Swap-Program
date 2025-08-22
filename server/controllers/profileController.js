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
    console.log('Update Profile Request Body:', req.body);
    console.log('Request Content-Type:', req.headers['content-type']);
    
    const { firstName, lastName, bio, location, skills, following, availability, contactInfo, socialLinks } = req.body;
    console.log('Raw contactInfo:', contactInfo);
    console.log('Raw socialLinks:', socialLinks);

    // Create the base profile fields object
    const profileFields = { firstName, lastName, bio, location, skills, following, availability, contactInfo, socialLinks };

    // Process contactInfo - handle both string (from FormData) and object formats
    if (contactInfo) {
        try {
            if (typeof contactInfo === 'string') {
                try {
                    profileFields.contactInfo = JSON.parse(contactInfo);
                } catch (parseErr) {
                    console.error('Error parsing contactInfo as JSON:', parseErr);
                    // If it's a string but not valid JSON, initialize as empty object
                    profileFields.contactInfo = {};
                }
            } else {
                profileFields.contactInfo = contactInfo;
            }
        } catch (err) {
            console.error('Error processing contactInfo:', err);
            profileFields.contactInfo = {};
        }
    } else {
        profileFields.contactInfo = {};
    }

    if (socialLinks) {
        try {
            if (typeof socialLinks === 'string') {
                try {
                    profileFields.socialLinks = JSON.parse(socialLinks);
                } catch (parseErr) {
                    console.error('Error parsing socialLinks as JSON:', parseErr);
                    profileFields.socialLinks = {};
                }
            } else {
                profileFields.socialLinks = socialLinks;
            }
        } catch (err) {
            console.error('Error processing socialLinks:', err);
            profileFields.socialLinks = {};
        }
    } else {
        profileFields.socialLinks = {};
    }
    
    console.log('Processed profileFields:', profileFields);
    
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
        console.log('Final profileFields before DB update:', JSON.stringify(profileFields, null, 2));
        
        const updateOperation = {
            $set: {
                firstName: profileFields.firstName,
                lastName: profileFields.lastName,
                bio: profileFields.bio,
                location: profileFields.location,
                skills: profileFields.skills,
                following: profileFields.following,
                availability: profileFields.availability,
                'contactInfo.phone': profileFields.contactInfo.phone || '',
                'contactInfo.publicEmail': profileFields.contactInfo.publicEmail || '',
                'socialLinks.github': profileFields.socialLinks.github || '',
                'socialLinks.linkedin': profileFields.socialLinks.linkedin || '',
                'socialLinks.twitter': profileFields.socialLinks.twitter || '',
                'socialLinks.website': profileFields.socialLinks.website || ''
            }
        };
        
        // Add profilePicture to update if it exists
        if (profileFields.profilePicture) {
            updateOperation.$set.profilePicture = profileFields.profilePicture;
        }
        
        console.log('Update operation:', JSON.stringify(updateOperation, null, 2));
        
        const user = await User.findByIdAndUpdate(req.user.id, updateOperation, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};