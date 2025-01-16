const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EditorSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
    thumbnail: { type: String },  
    author: { type: String, required: true }, 
    date: { type: Date, default: Date.now }, 
});

const EditorModel = mongoose.model('Editor', EditorSchema);
module.exports = EditorModel;

