const mongoose = require('mongoose');
const yup = require('yup');


const livre = new mongoose.Schema({
    id : String,
    title: String,
    author: String,
    genre : String,
    price : Number,
    available : Boolean,
  
});

const ValidationSchema = yup.object().shape({
    title: yup.string().required(),
    author: yup.string().required(),
    genre: yup.string().required(),
    price: yup.number().required().positive(),
    available: yup.boolean().required()
  });

const Livre = mongoose.model('livre', livre); // Create a model from the schema
module.exports =  {Livre, ValidationSchema}; // Export the model and schema