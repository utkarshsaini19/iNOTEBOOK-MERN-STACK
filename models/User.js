const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:  {
        type: String,
        require: true
    },
    email:  {
        type: String,
        require: true,
        unique: true
    },
    password:  {
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
    
    
  });

  // For unique value
  const User = mongoose.model('users',UserSchema);
  //User.createIndexes();
  module.exports = User;