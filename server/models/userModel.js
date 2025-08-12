const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // --- Existing Fields (Kept) ---
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { // Kept at top-level for unique constraint and login
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'volunteer', 'user'], 
        default: 'user' 
    },
    location: { 
        type: String, 
        default: '' 
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

    // --- NEW & UPDATED Profile Fields ---

    profilePicture: { 
        type: String, 
        default: 'default-avatar.png' // Path to a default image in your public/assets folder
    },
    bio: { 
        type: String, 
        maxlength: 500, // Good practice to add a max length
        default: '' 
    },
    contactInfo: { // NEW: Object to group contact details
        phone: { type: String, default: '' },
        publicEmail: { type: String, default: '' } // A separate email for public display if desired
    },
    skills: { // UPDATED: More structured to match "Offer/Receive" feature
        offer: { type: [String], default: [] },
        receive: { type: [String], default: [] }
    },
    volunteerHistory: [{ // NEW: Array of references to a Task model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' // This assumes you will have a 'Task' model
    }],
    credits: { // NEW: Detailed credit tracking
        earned: { type: Number, default: 0 },
        spent: { type: Number, default: 0 }
    },
    ratingSummary: { // NEW: Structured object for ratings
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 } // Total number of ratings received
    },
    socialLinks: { // Kept from original, fits well
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
    }
});

// --- OPTIONAL BUT RECOMMENDED: Mongoose Virtual for current credit balance ---
// This creates a "virtual" field that is not stored in the database but can be accessed
// like any other field on a user document. It's calculated on the fly.
userSchema.virtual('credits.balance').get(function() {
    return this.credits.earned - this.credits.spent;
});

// To include virtuals when you convert a document to JSON (e.g., sending it in an API response)
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });


module.exports = mongoose.model('User', userSchema);