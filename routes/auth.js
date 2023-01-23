const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fetchuser = require('../middleware/fetchuser');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const SECRET = process.env.SECRET;


const JWT_SECRET = SECRET;


//Route 1 : Create a user using: POST "/api/auth/createuser" , No need of authentication
router.post('/createuser', [
  body('email', "Enter a valid email").isEmail(),
  body('name', "Enter name of length > 3").isLength({ min: 3 }),
  body('password', "Enter password of length > 5").isLength({ min: 5 })
]
  , async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    // If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send(req.body);

    // User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //   }).then(user => res.json(user))
    //   .catch(err =>{
    //     console.log(err);
    //     res.status(400).json({error : "Please enter a unique value for Email",message:err.message})
    //   });

    // Check whether user with this email exists already
    try {

      console.log("Inside create user try block");
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ success,error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Creating a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })

      const data = {
        user: {
          id: user._id
        }
      }

      const authtoken = await jwt.sign(data, JWT_SECRET);
      //console.log(jwtData);

      // res.json(user);
      success=true;
      res.json({ success,authtoken })


    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error")
    }
  })

//Route 2 : Authenticate a user using: POST "/api/auth/login"

router.post('/login', [
  body('email', "Enter a valid email").isEmail(),
  body('password', "Password Cannot be Blank").exists()
]
  , async (req, res) => {

    let success = false;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ success,error: "Please try to login with correct credentials" });
      }

      const passwordCompare = bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({ success,error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user._id
        }
      }

      

      const authtoken = await jwt.sign(data, JWT_SECRET);
      success=true;

      res.json({ success,authtoken })


    } catch (error) {

      console.log(error.message);
      res.status(500).send("Internal Server Error")

    }



  })

//Route 3 : Get loggedin user detais using: POST "/api/auth/getuser". Login Required
router.post('/getuser',fetchuser , async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error")
    }
  })

module.exports = router;