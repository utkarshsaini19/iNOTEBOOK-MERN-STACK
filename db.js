require('dotenv').config()
const mongoose = require('mongoose');
const mongoURI = process.env.DATABASE;



mongoose.set('strictQuery', true);
const connectToMongo = async() =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongo successfully");
    })

}

module.exports = connectToMongo;


