const mongoose = require('mongoose');


const livre = new mongoose.Schema({
    id :String,
    title: String,
    author: String,
    genre : String,
    price : Number,
    available : Boolean,
  
});

const Livre = mongoose.model('livre', livre); // Create a model from the schema
module.exports =  Livre; // Export the model and schema