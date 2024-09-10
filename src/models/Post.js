const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    stockSymbol: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs
    likesCount: { type: Number, default: 0 }, // Count of likes
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
