import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // --- Core Identity Fields (from your original file) ---
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'volunteer', 'user'], default: 'user' },
    
    // --- Basic Profile & Status Fields (from your original file, enhanced) ---
    profilePicture: { 
        type: String, 
        default: 'default-avatar.svg' // Using a more descriptive default name
    },
    bio: { 
        type: String, 
        default: '',
        maxlength: 500 // Added a max length for good practice
    },
    location: { type: String, default: '' },
    status: { type: Boolean, default: true }, // General active/inactive status
    accountStatus: { // More specific status from your original file
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    },
    
    // --- NEW: Highly Structured Profile Fields (for your new features) ---
    contactInfo: {
        phone: { type: String, default: '' },
        publicEmail: { type: String, default: '' }
    },
    skills: { type: [String], default: [] }, // Changed to simple array like following

    following: { type: [String], default: [] }, // Changed to simple array like interests

    interests: { type: [String], default: [] }, // Kept from your original file
    availability: { type: String, default: 'Flexible' }, // Changed default to be more descriptive
    
    volunteerHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' // Assumes you have or will have a 'Task' model
    }],
    credits: {
        earned: { type: Number, default: 10 },
        spent: { type: Number, default: 0 }
    },
    ratingSummary: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    socialLinks: { // Kept from your original file
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    myTasks: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Task'
    }],
    
    // --- Metadata (from your original file) ---
    flag: { type: Boolean, default: false }, // Kept from your original file
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    // Adding timestamps is a good practice to automatically get createdAt and updatedAt
    timestamps: true 
});


// --- VIRTUALS for calculated properties (highly recommended) ---

// Creates a "virtual" field for the user's full name
userSchema.virtual('fullName').get(function() {
  const first = this.firstName || '';
  const last = this.lastName || '';
  return `${first} ${last}`.trim();
});
// Creates a "virtual" field for the user's current credit balance
userSchema.virtual('credits.balance').get(function() {
  // Use `|| 0` to handle cases where a field might be missing on an old document
  const earned = this.credits.earned || 0;
  const spent = this.credits.spent || 0;
  return earned - spent;
});

// To include virtuals when you convert a document to JSON (e.g., in an API response)
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });


export default mongoose.model('User', userSchema);