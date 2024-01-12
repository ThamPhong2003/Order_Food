const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    sdt: { type: String },
    fullname: { type: String },
    avt: { type: String },
    address: { type: String },
    slug: { type: String, unique: true, lowercase: true },
});

// Hash password before saving to the database
usersSchema.pre('save', async function (next) {
    const user = this;

    // Check if the password is modified or is new
    if (user.isModified('password')) {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(10);

            // Hash the password with the salt
            const hash = await bcrypt.hash(user.password, salt);

            // Set the password to the hashed version
            user.password = hash;
        } catch (error) {
            return next(error);
        }
    }

    // Check if the slug is not set or is duplicated
    if (!user.slug || (await mongoose.model('users').countDocuments({ slug: user.slug, _id: { $ne: user._id } }) > 0)) {
        // Generate a new unique slug based on the username
        user.slug = user.username.replace(/\s+/g, '-').toLowerCase();
    }

    // Continue with saving
    next();
});

// Add comparePassword method to the model
usersSchema.methods.comparePassword = async function (candidatePassword) {
    // Check if the password is valid and not null or undefined
    if (!candidatePassword || typeof candidatePassword !== 'string') {
        return false;
    }

    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', usersSchema);
