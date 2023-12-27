const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const removeDiacritics = require('diacritics').remove;

const foods = new Schema({
    name: { type: String },
    description: { type: String },
    img: { type: String },
    soluong: { type: Number },
    gia: { type: String },
    slug: { type: String, unique: true },
});

// Middleware to auto-generate slug based on the 'name' field
foods.pre('save', function (next) {
    // Check if the 'slug' field is not set or is empty
    if (!this.slug || this.slug.trim().length === 0) {
        // Generate the slug based on the 'name' field without diacritics
        const nameWithoutDiacritics = removeDiacritics(this.name);
        this.slug = nameWithoutDiacritics.toLowerCase().split(' ').join('-');
    }

    next();
});

module.exports = mongoose.model('foods', foods);
